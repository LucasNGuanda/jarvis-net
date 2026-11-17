/* Química · aba Experimentos, módulo Nuclear (EQ12 a EQ14).
   DADOS (tools/quimica/dadosX.json, seções "decaimento", "fissao" e "fusao"; conferidos por tools/quimica/confere-dadosX.py, que compara cada constante daqui com o JSON):
   SIM.NUCL.MEIA: meia-vida, modo e produto de cada isótopo (Wikipedia, página de cada isótopo). Fissão do U-235: 200 MeV por fissão e 2,5 nêutrons em média
   (página "Nuclear fission"; a página "Uranium-235" dá 202,5 MeV e 2,43: divergência registrada). Fusão D + T → He-4 (3,5 MeV) + n (14,1 MeV) = 17,6 MeV.
   EQ13 SIM.eqDecaimento: 400 núcleos; a cada passo, cada um decai com probabilidade 1 − 2^(−dt/T½). Nada obriga a curva: ela sai do acaso.
   EQ12 SIM.eqFissao: amostra de núcleos físseis; cada nêutron anda em linha reta e, ao encontrar um núcleo físsil, provoca fissão (2 ou 3 nêutrons novos, média 2,5).
     Núcleos não físseis e barras de controle absorvem; nêutron que sai da amostra se perde. MODELO em 2D: o tamanho "crítico" da tela não é a massa crítica real.
   EQ14 SIM.eqFusao: núcleos de deutério e de trítio num plasma; fundem-se quando a energia do choque vence a barreira. MODELO: a barreira da simulação é
     um número ajustado para caber na tela (a real é da ordem de 0,1 MeV, e o tunelamento permite fusão abaixo dela). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), G = SIM.expGas;
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const T = (x, y, s, a = "middle", c = "tx2", t = 12) => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}" style="font-size:${t}px">${s}</text>`;

  SIM.NUCL = {
    /* id: [símbolo, meia-vida, unidade, modo, produto] */
    MEIA: { C14: ["¹⁴C", 5700, "anos", "β⁻", "¹⁴N"], I131: ["¹³¹I", 8.0249, "dias", "β⁻", "¹³¹Xe"], H3: ["³H", 12.32, "anos", "β⁻", "³He"], Cs137: ["¹³⁷Cs", 30.04, "anos", "β⁻", "¹³⁷Ba"], Ra226: ["²²⁶Ra", 1600, "anos", "α", "²²²Rn"], Rn222: ["²²²Rn", 3.8215, "dias", "α", "²¹⁸Po"], Po210: ["²¹⁰Po", 138.376, "dias", "α", "²⁰⁶Pb"], U238: ["²³⁸U", 4.463e9, "anos", "α", "²³⁴Th"] },
    FISSAO_MEV: 200, NEUTRONS: 2.5, DT_MEV: 17.6, DT_HE: 3.5, DT_N: 14.1, SOL_MK: 15.7 };
  SIM.decai = (N0, t, meia) => N0 * Math.pow(2, -t / meia);
  const grande = (v) => (v >= 1e9 ? n2(v / 1e9, 2) + " bilhões de" : v >= 1e6 ? n2(v / 1e6, 2) + " milhões de" : v >= 1e4 ? n2(v / 1000, 1) + " mil" : n2(v, v < 100 ? 1 : 0));

  /* ---------- EQ13 · decaimento e meia-vida ---------- */
  /* nome: "Decaimento: o acaso que obedece a uma curva" · matéria: Química · tema: EQ13 */
  SIM.eqDecaimento = (el, F) => { const W = 680, H = 300, N0 = 400, COL = 20; let rnd = Math.random, iso = "C14", vivos = [], t = 0, vel = 0.25, hist = [], pausado = false;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">isótopo</p><div class="bts">${botoes(Object.keys(SIM.NUCL.MEIA).map((k) => [k, SIM.NUCL.MEIA[k][0]]), "i", iso)}</div></div>
      <div>${sl("velocidade (meias-vidas por segundo)", "v", 0.05, 1, 0.05, 0.25)}<div class="bts"><button class="bt pri" data-a="re">Amostra nova</button><button class="bt" data-a="pa" aria-pressed="false">Pausar</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), reinicia = () => { vivos = new Array(N0).fill(true); t = 0; hist = [[0, N0]]; };
    const resta = () => vivos.reduce((a, v) => a + (v ? 1 : 0), 0);
    /* dtm em meias-vidas */
    const passo = (dtm) => { const p = 1 - Math.pow(2, -dtm); for (let i = 0; i < N0; i++) if (vivos[i] && rnd() < p) vivos[i] = false; t += dtm; if (t - hist[hist.length - 1][0] >= 0.05 && hist.length < 400) hist.push([t, resta()]); };
    const est = () => { const M = SIM.NUCL.MEIA[iso], n = resta(); return { iso, meia: M[1], un: M[2], t, tReal: t * M[1], n, teor: SIM.decai(N0, t, 1), idade: n > 0 ? Math.log2(N0 / n) * M[1] : null }; };
    const desenha = () => { const e = est(), M = SIM.NUCL.MEIA[iso]; q("[data-o=v]").textContent = n2(vel, 2);
      let s = ""; for (let i = 0; i < N0; i++) s += `<circle cx="${26 + (i % COL) * 13.2}" cy="${26 + Math.floor(i / COL) * 13.2}" r="5" style="fill:${vivos[i] ? "var(--warn)" : "var(--ink3)"};opacity:${vivos[i] ? 1 : 0.35}"/>`;
      const gx = 330, gy = 262, gw = 320, gh = 220, tm = Math.max(5, Math.ceil(t)), X = (x) => gx + gw * x / tm, Y = (n) => gy - gh * n / N0;
      s += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" style="stroke:var(--ink3)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" style="stroke:var(--ink3)"/>`; let d = ""; for (let i = 0; i <= 80; i++) { const x = tm * i / 80; d += (i ? "L" : "M") + X(x).toFixed(1) + "," + Y(SIM.decai(N0, x, 1)).toFixed(1); }
      s += `<path d="${d}" style="fill:none;stroke:var(--ink2);stroke-width:1.5;stroke-dasharray:5 4"/><path d="${hist.map((p, i) => (i ? "L" : "M") + X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1)).join("")}" style="fill:none;stroke:var(--warn);stroke-width:2"/>`;
      for (let k = 0; k <= tm; k++) s += T(X(k), gy + 14, k, "middle", "tx2", 10); s += T(gx + gw / 2, gy + 30, "tempo (em meias-vidas de " + grande(M[1]) + " " + M[2] + ")", "middle", "tx2", 10) + T(gx - 5, Y(N0) + 4, N0, "end", "tx2", 10) + T(gx - 5, Y(N0 / 2) + 4, N0 / 2, "end", "tx2", 10) + T(gx + gw, 34, "tracejado: N₀·(½)^(t/T½)", "end", "tx2", 10);
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis(`${M[0]} → ${M[4]} (${M[3]})`, "T½ = " + grande(M[1]) + " " + M[2]) + vis("núcleos que restam", e.n + " de " + N0) + vis("previsto pela lei", n2(e.teor, 0)) + vis("tempo decorrido", grande(e.tReal) + " " + M[2]) + vis("idade calculada pela fração", e.idade === null ? "—" : grande(e.idade) + " " + M[2]);
      q("[data-v=st]").innerHTML = "Cada bolinha laranja é um núcleo radioativo. Ninguém sabe quando um núcleo vai decair: a cada instante, cada um tem a mesma chance, não importa a idade. Mesmo assim, o conjunto segue uma curva certa: a cada meia-vida, sobra metade. A linha laranja é a contagem de verdade; a tracejada, a lei. Com 400 núcleos, a contagem treme em volta da lei; numa amostra real, com trilhões de trilhões, o tremor some. A \"idade calculada\" faz o caminho inverso, como na datação: da fração que resta ao tempo que passou. Meias-vidas: dados de fonte (Wikipedia)."; };
    liga(el, "i", (v) => { iso = v; reinicia(); }); q("[data-c=v]").addEventListener("input", () => { vel = +q("[data-c=v]").value; }); q("[data-a=re]").addEventListener("click", reinicia); q("[data-a=pa]").addEventListener("click", (ev) => { pausado = !pausado; ev.target.setAttribute("aria-pressed", String(pausado)); });
    reinicia(); anima(el, F, (dt) => { if (!pausado && resta() > 0) passo(vel * dt); desenha(); });
    SIM.eqDecaimento._ult = { semente: (n) => { rnd = G.rng(n); reinicia(); }, poe: (i) => { iso = i; el.querySelectorAll("[data-i]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.i === i))); reinicia(); }, avanca: (meias) => { const n = Math.round(meias / 0.01); for (let i = 0; i < n; i++) passo(0.01); desenha(); }, est }; };

  /* ---------- EQ12 · fissão em cadeia ---------- */
  /* nome: "Fissão em cadeia: um nêutron, dois ou três de volta" · matéria: Química · tema: EQ12 */
  SIM.eqFissao = (el, F) => { const W = 680, H = 300, cx = 230, cy = 150, PASSO = 13, RN = 4.2, RC = 1.5, VN = 240; /* RN: raio do desenho; RC: raio de captura */ let rnd = Math.random, lado = 13, pureza = 1, barras = 0, nuc = [], neu = [], frag = [], fis = 0, ger = [], perd = 0, abs = 0, lanc = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("tamanho da amostra (núcleos por lado)", "L", 5, 19, 2, 13)}${sl("núcleos físseis (%)", "P", 10, 100, 5, 100)}</div>
      <div>${sl("barras de controle", "B", 0, 4, 1, 0)}<div class="bts"><button class="bt pri" data-a="n">Disparar um nêutron</button><button class="bt" data-a="re">Amostra nova</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const xb = () => { const o = []; for (let k = 0; k < barras; k++) o.push(cx + (k - (barras - 1) / 2) * (lado * PASSO / (barras + 0.5))); return o; };
    const reinicia = () => { nuc = []; neu = []; frag = []; fis = 0; ger = []; perd = 0; abs = 0; lanc = 0; const m = (lado - 1) / 2; for (let i = 0; i < lado; i++) for (let j = 0; j < lado; j++) nuc.push({ x: cx + (i - m) * PASSO, y: cy + (j - m) * PASSO, f: rnd() < pureza, vivo: true }); };
    const dispara = () => { const a = rnd() * 2 * Math.PI; neu.push({ x: cx - (lado / 2 + 2) * PASSO, y: cy + (rnd() - 0.5) * lado * PASSO * 0.6, vx: VN, vy: VN * 0.15 * Math.sin(a), g: 0 }); lanc++; };
    const passo = (dt) => { const R = lado * PASSO / 2 + 6, B = xb(), novos = [];
      for (const n of neu) { const xa = n.x; n.x += n.vx * dt; n.y += n.vy * dt; if (Math.abs(n.x - cx) > R + 60 || Math.abs(n.y - cy) > R + 60) { n.fim = true; perd++; continue; }
        if (Math.abs(n.y - cy) < R && B.some((b) => (xa - b) * (n.x - b) <= 0)) { n.fim = true; abs++; continue; }
        for (const u of nuc) { if (!u.vivo) continue; const dx = u.x - n.x, dy = u.y - n.y; if (dx * dx + dy * dy < RC * RC) { n.fim = true; if (!u.f) { abs++; break; } u.vivo = false; fis++; ger[n.g] = (ger[n.g] || 0) + 1; const k = rnd() < 0.5 ? 2 : 3; for (let i = 0; i < k; i++) { const a = rnd() * 2 * Math.PI; novos.push({ x: u.x + 6 * Math.cos(a), y: u.y + 6 * Math.sin(a), vx: VN * Math.cos(a), vy: VN * Math.sin(a), g: n.g + 1 }); } const a = rnd() * 2 * Math.PI; frag.push({ x: u.x, y: u.y, vx: 60 * Math.cos(a), vy: 60 * Math.sin(a), t: 0 }, { x: u.x, y: u.y, vx: -60 * Math.cos(a), vy: -60 * Math.sin(a), t: 0 }); break; } } }
      neu = neu.filter((n) => !n.fim).concat(novos); frag.forEach((f) => { f.x += f.vx * dt; f.y += f.vy * dt; f.t += dt; }); frag = frag.filter((f) => f.t < 0.5); };
    const est = () => { const fisseis = nuc.filter((u) => u.f).length, k = ger.length > 1 ? ger.slice(1).reduce((a, x) => a + x, 0) / Math.max(1, ger.slice(0, -1).reduce((a, x) => a + x, 0)) : null; return { lado, pureza, barras, total: nuc.length, fisseis, fis, fracao: fisseis ? fis / fisseis : 0, ger: ger.slice(), k, perd, abs, lanc, voando: neu.length, MeV: fis * SIM.NUCL.FISSAO_MEV }; };
    const desenha = () => { const e = est(), R = lado * PASSO / 2 + 6; q("[data-o=L]").textContent = lado + " × " + lado; q("[data-o=P]").textContent = Math.round(100 * pureza) + " %"; q("[data-o=B]").textContent = barras;
      let s = `<rect x="${cx - R}" y="${cy - R}" width="${2 * R}" height="${2 * R}" rx="6" style="fill:none;stroke:var(--ink3);stroke-dasharray:4 4"/>`;
      nuc.forEach((u) => { if (u.vivo) s += `<circle cx="${u.x}" cy="${u.y}" r="${RN}" style="fill:${u.f ? "var(--ok)" : "var(--ink3)"}"/>`; });
      xb().forEach((b) => (s += `<rect x="${b - 2.5}" y="${cy - R - 8}" width="5" height="${2 * R + 16}" style="fill:var(--ink)"/>`));
      frag.forEach((f) => (s += `<circle cx="${f.x.toFixed(1)}" cy="${f.y.toFixed(1)}" r="3" style="fill:var(--bad);opacity:${(1 - 2 * f.t).toFixed(2)}"/>`)); neu.forEach((n) => (s += `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="2.2" style="fill:var(--warn)"/>`));
      const gx = 470, gy = 250, gw = 190, gh = 190, mx = Math.max(4, ...e.ger); s += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" style="stroke:var(--ink3)"/>` + T(gx + gw / 2, 30, "fissões em cada geração", "middle", "tx2", 11); const nb = Math.max(8, e.ger.length); e.ger.forEach((v, i) => (s += `<rect x="${(gx + gw * i / nb).toFixed(1)}" y="${(gy - gh * v / mx).toFixed(1)}" width="${(gw / nb - 2).toFixed(1)}" height="${(gh * v / mx).toFixed(1)}" style="fill:color-mix(in srgb,var(--warn) 55%,transparent);stroke:var(--warn)"/>`)); s += T(gx + gw / 2, gy + 16, "geração", "middle", "tx2", 10);
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("fissões", e.fis + " de " + e.fisseis + " núcleos físseis") + vis("nêutrons que escaparam", e.perd) + vis("nêutrons absorvidos", e.abs) + vis("fator k medido", e.k === null ? "—" : n2(e.k, 2)) + vis("energia liberada", grande(e.MeV) + " MeV");
      q("[data-v=st]").innerHTML = "Um nêutron que acerta um núcleo físsil (verde) o parte em dois e solta 2 ou 3 nêutrons novos (2,5 em média no ²³⁵U) e cerca de 200 MeV. Se, em média, mais de um desses nêutrons provoca outra fissão (k &gt; 1), cada geração é maior que a anterior: reação em cadeia. Amostra pequena: os nêutrons escapam pelas bordas antes de achar um núcleo, e a reação morre (k &lt; 1). Núcleos não físseis (cinza) e barras de controle absorvem nêutrons: é assim que um reator mantém k = 1. Modelo em duas dimensões: o tamanho que dá k = 1 na tela não é a massa crítica real. Números do ²³⁵U: dados de fonte."; };
    const le = () => { lado = +q("[data-c=L]").value; pureza = +q("[data-c=P]").value / 100; barras = +q("[data-c=B]").value; reinicia(); };
    el.querySelectorAll("input[type=range]").forEach((i) => i.addEventListener("input", le)); q("[data-a=n]").addEventListener("click", dispara); q("[data-a=re]").addEventListener("click", reinicia);
    reinicia(); anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqFissao._ult = { semente: (n) => { rnd = G.rng(n); reinicia(); }, poe: (L, P, B) => { lado = L; pureza = P; barras = B; q("[data-c=L]").value = L; q("[data-c=P]").value = 100 * P; q("[data-c=B]").value = B; reinicia(); }, dispara, roda: () => { let k = 0; while (neu.length && k++ < 20000) passo(1 / 120); desenha(); return est(); }, est }; };

  /* ---------- EQ14 · fusão ---------- */
  /* nome: "Fusão nuclear: vencer a repulsão" · matéria: Química · tema: EQ14 */
  SIM.eqFusao = (el, F) => { const W = 680, H = 300, bx = 20, by = 20, bw = 420, bh = 250, r = 5, N = 40, EB = 6; let rnd = Math.random, Tm = 40, ps = [], fus = 0, choq = 0, t = 0, fl = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div>${sl("temperatura do plasma (milhões de K)", "T", 5, 200, 5, 40)}</div><div><div class="bts"><button class="bt pri" data-a="re">Plasma novo</button></div><p style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)">Azul: deutério (²H). Laranja: trítio (³H). Verde: hélio-4. Branco: nêutron.</p></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), sig = (m) => 34 * Math.sqrt(Tm / 40) / Math.sqrt(m / 2);
    const nova = (tipo) => { const m = tipo ? 3 : 2, s = sig(m); return { tipo, m, r, x: bx + r + rnd() * (bw - 2 * r), y: by + r + rnd() * (bh - 2 * r), vx: G.gauss(rnd) * s, vy: G.gauss(rnd) * s }; };
    const reinicia = () => { ps = []; fus = 0; choq = 0; t = 0; fl = []; for (let i = 0; i < N; i++) { ps.push(nova(0)); ps.push(nova(1)); } };
    /* energia do choque ao longo da linha dos centros, em unidades de kT a 40 milhões de K; funde se passar de EB */
    const passo = (dt) => { const n = 4, h = dt / n, kT0 = 34 * 34 * 2; for (let k = 0; k < n; k++) { for (const p of ps) { const s = sig(p.m), nrm = () => s * Math.sqrt(-2 * Math.log(1 - rnd() * 0.999999)), tg = () => G.gauss(rnd) * s; p.x += p.vx * h; p.y += p.vy * h; const term = p.tipo < 2;
          if (p.x < bx + p.r) { p.x = bx + p.r; p.vx = term ? nrm() : -p.vx; if (term) p.vy = tg(); } if (p.x > bx + bw - p.r) { p.x = bx + bw - p.r; p.vx = term ? -nrm() : -p.vx; if (term) p.vy = tg(); } if (p.y < by + p.r) { p.y = by + p.r; p.vy = term ? nrm() : -p.vy; if (term) p.vx = tg(); } if (p.y > by + bh - p.r) { p.y = by + bh - p.r; p.vy = term ? -nrm() : -p.vy; if (term) p.vx = tg(); } }
        for (let i = 0; i < ps.length; i++) { const a = ps[i]; if (a.tipo > 1) continue; for (let j = i + 1; j < ps.length; j++) { const b = ps[j]; if (b.tipo > 1) continue; const dx = b.x - a.x, dy = b.y - a.y, R = a.r + b.r; if (Math.abs(dx) > R || Math.abs(dy) > R) continue; const d2 = dx * dx + dy * dy; if (d2 >= R * R || d2 === 0) continue; const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (vn >= 0) continue; const mu = a.m * b.m / (a.m + b.m);
            if (a.tipo !== b.tipo) { choq++; if (0.5 * mu * vn * vn / kT0 >= EB) { fus++; const an = rnd() * 2 * Math.PI, X = (a.x + b.x) / 2, Y = (a.y + b.y) / 2; fl.push({ x: X, y: Y, t: 0 }); Object.assign(a, { tipo: 2, m: 4, r: 6, x: X, y: Y, vx: 120 * Math.cos(an), vy: 120 * Math.sin(an) }); Object.assign(b, { tipo: 3, m: 1, r: 3, x: X, y: Y, vx: -480 * Math.cos(an), vy: -480 * Math.sin(an) }); break; } }
            const J = 2 * mu * vn; a.vx += (J / a.m) * nx; a.vy += (J / a.m) * ny; b.vx -= (J / b.m) * nx; b.vy -= (J / b.m) * ny; } } }
      t += dt; fl.forEach((f) => (f.t += dt)); fl = fl.filter((f) => f.t < 0.4); };
    const est = () => { const c = [0, 0, 0, 0]; ps.forEach((p) => c[p.tipo]++); return { Tm, fus, choq, D: c[0], Tr: c[1], He: c[2], n: c[3], MeV: fus * SIM.NUCL.DT_MEV, fr: choq ? fus / choq : null, teor: Math.exp(-EB * 40 / Tm), t }; };
    const desenha = () => { const e = est(); q("[data-o=T]").textContent = Tm + " MK";
      let s = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" style="fill:rgba(255,140,60,${Math.min(0.25, Tm / 900).toFixed(3)});stroke:var(--ink2);stroke-width:2"/>`;
      fl.forEach((f) => (s += `<circle cx="${f.x.toFixed(1)}" cy="${f.y.toFixed(1)}" r="${(6 + 60 * f.t).toFixed(1)}" style="fill:none;stroke:var(--warn);stroke-width:2;opacity:${(1 - 2.5 * f.t).toFixed(2)}"/>`));
      ps.forEach((p) => (s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r}" style="fill:${["var(--mA)", "var(--warn)", "var(--ok)", "#e8ecf2"][p.tipo]}"/>`));
      s += T(560, 60, "²H + ³H → ⁴He + n", "middle", "tx", 15) + T(560, 84, "17,6 MeV por fusão", "middle", "tx2", 12) + T(560, 104, "(⁴He: 3,5 MeV; nêutron: 14,1 MeV)", "middle", "tx2", 11) + T(560, 150, "núcleo do Sol: 15,7 milhões de K", "middle", "tx2", 11) + T(560, 190, e.fus, "middle", "tx", 34) + T(560, 210, "fusões", "middle", "tx2", 12);
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("choques ²H–³H", e.choq) + vis("fusões", e.fus) + vis("fração que funde", e.fr === null ? "—" : n2(100 * e.fr, 2) + " %") + vis("energia liberada", n2(e.MeV, 1) + " MeV") + vis("²H | ³H | ⁴He | n", e.D + " | " + e.Tr + " | " + e.He + " | " + e.n);
      q("[data-v=st]").innerHTML = "Os dois núcleos são positivos e se repelem. Só se fundem se chegarem tão perto que a força nuclear, de curtíssimo alcance, vença a repulsão elétrica (barreira de Coulomb). Para isso precisam bater com muita energia, ou seja, o plasma tem de estar a dezenas de milhões de kelvin. A frio, os núcleos só ricocheteiam. Aqueça e veja a fração de choques que funde disparar. Cada fusão dá um ⁴He e um nêutron, que leva a maior parte da energia (é o mais leve). Modelo: a barreira da simulação é um número escolhido para a tela; no mundo real, a barreira é da ordem de 0,1 MeV e o tunelamento quântico permite fusão abaixo dela. Energias da reação e temperatura do Sol: dados de fonte."; };
    q("[data-c=T]").addEventListener("input", () => { const a = Tm; Tm = +q("[data-c=T]").value; const f = Math.sqrt(Tm / a); ps.forEach((p) => { if (p.tipo < 2) { p.vx *= f; p.vy *= f; } }); }); q("[data-a=re]").addEventListener("click", reinicia);
    reinicia(); anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqFusao._ult = { semente: (n) => { rnd = G.rng(n); reinicia(); }, poe: (Tn) => { Tm = Tn; q("[data-c=T]").value = Tn; reinicia(); }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); }, est }; };
})();
