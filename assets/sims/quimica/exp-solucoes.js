/* Química · aba Experimentos, módulo Soluções e indicadores (EQ24 e EQ25).
   EQ24 SIM.eqCristal: 100 g de água com m gramas de sal; dissolvido = mínimo entre m e a solubilidade s(T). As curvas s(T) são as de SIM.SOLUB / SIM.solub
     (assets/sims/quimica/solucoes.js, com fonte em tools/quimica/dadosE.json). MODELO: o excesso cristaliza assim que a curva é cruzada (sem supersaturação),
     e o número de cristais (poucos e grandes ao esfriar devagar, muitos e pequenos ao esfriar depressa) é ilustrativo (dito na tela).
   EQ25 SIM.eqRepolho: pH de substâncias de casa da tabela "Average pH of common solutions" da Wikipedia (página "PH"), em tools/quimica/dadosX.json, seção "repolho_roxo";
     cores do extrato de repolho roxo: a fonte dá três faixas (ácido: vermelho, rosa ou magenta; neutro: roxo; básico: de azul a verde a amarelo).
     A posição das viragens DENTRO de cada faixa é ilustrativa (dito na tela). Constantes conferidas por tools/quimica/confere-dadosX.py. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const n2 = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const T = (x, y, s, a = "middle", c = "tx2", t = 12) => `<text x="${x}" y="${y}" text-anchor="${a}" class="${c}" style="font-size:${t}px">${s}</text>`;

  /* ---------- EQ24 · cristalização ---------- */
  SIM.cristaliza = (sal, m, Tc) => { const s = SIM.solub(sal, Tc), d = Math.min(m, s); return { s, dissolvido: d, cristais: m - d, saturada: m >= s }; };
  /* nome: "Cristalização: aquecer, dissolver, esfriar e ver crescer" · matéria: Química · tema: EQ24 */
  SIM.eqCristal = (el, F) => { const W = 680, H = 310, SAIS = ["KNO3", "KClO3", "NH4Cl", "NaCl"]; let sal = "KNO3", m = 110, Tc = 70, esfria = 0, rapido = false, t = 0, sem = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(SAIS.map((k) => [k, SIM.SOLUB[k].f]), "s", sal)}</div>${sl("sal colocado (g em 100 g de água)", "m", 5, 200, 1, 110)}</div>
      <div>${sl("temperatura (°C)", "T", 0, 100, 1, 70)}<div class="bts"><button class="bt pri" data-a="le">Esfriar devagar</button><button class="bt" data-a="ra">Esfriar depressa</button><button class="bt" data-a="aq">Aquecer</button><button class="bt" data-a="pa">Parar</button></div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ sal, m, T: Tc, esfria, rapido, ...SIM.cristaliza(sal, m, Tc), ncrist: sem.length });
    const semeia = () => { const n = rapido ? 40 : 9; sem = []; let a = 7; for (let i = 0; i < n; i++) { a = (a * 16807) % 2147483647; const u = a / 2147483647; a = (a * 16807) % 2147483647; sem.push([u, a / 2147483647]); } };
    const passo = (dt) => { t += dt; if (esfria) { Tc = Math.max(0, Math.min(100, Tc + esfria * dt)); q("[data-c=T]").value = Tc; if (Tc <= 0 || Tc >= 100) esfria = 0; } };
    const desenha = () => { const e = est(), S = SIM.SOLUB[sal]; q("[data-o=m]").textContent = m + " g"; q("[data-o=T]").textContent = n2(Tc, 0) + " °C";
      const bx = 60, by = 60, bw = 220, bh = 200; let s = `<path d="M${bx},${by} v${bh} h${bw} v${-bh}" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="${bx + 2}" y="${by + 30}" width="${bw - 4}" height="${bh - 32}" style="fill:rgb(${Math.round(80 + 1.2 * Tc)},${Math.round(150 - 0.4 * Tc)},${Math.round(215 - 1.2 * Tc)});opacity:.3"/>`;
      if (e.cristais > 0.05) { const lado = Math.min(34, 3.2 * Math.cbrt(e.cristais / sem.length * 40)); sem.forEach(([u, v]) => { const x = bx + 14 + u * (bw - 28 - lado), y = by + bh - 4 - lado - v * Math.min(40, e.cristais * 0.25); s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${lado.toFixed(1)}" height="${lado.toFixed(1)}" transform="rotate(${(u * 50 - 25).toFixed(0)} ${(x + lado / 2).toFixed(1)} ${(y + lado / 2).toFixed(1)})" style="fill:#e8ecf2;opacity:.85;stroke:var(--ink2);stroke-width:.7"/>`; }); }
      if (Tc > 60) for (let k = 0; k < 4; k++) s += `<path d="M${bx + 40 + 45 * k},${by + 10 - ((t * 20 + k * 9) % 30)} q6,-8 0,-16" style="fill:none;stroke:var(--ink3);stroke-width:1.5;opacity:${(0.2 + (Tc - 60) / 80).toFixed(2)}"/>`;
      s += T(bx + bw / 2, by + bh + 22, "100 g de água a " + n2(Tc, 0) + " °C", "middle", "tx2", 12) + T(bx + bw / 2, by + bh + 40, e.cristais > 0.05 ? n2(e.cristais, 1) + " g de cristais no fundo" : "tudo dissolvido", "middle", "tx", 12);
      const gx = 350, gy = 270, gw = 300, gh = 220, mx = Math.max(60, Math.min(250, Math.max(SIM.solub(sal, 100) * 1.15, m * 1.1))), X = (x) => gx + gw * x / 100, Y = (y) => gy - gh * Math.min(mx, y) / mx;
      s += `<line x1="${gx}" y1="${gy}" x2="${gx + gw}" y2="${gy}" style="stroke:var(--ink3)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy - gh}" style="stroke:var(--ink3)"/>`; let d = ""; for (let x = 0; x <= 100; x += 2) d += (x ? "L" : "M") + X(x).toFixed(1) + "," + Y(SIM.solub(sal, x)).toFixed(1);
      s += `<path d="${d}" style="fill:none;stroke:var(--mod);stroke-width:2"/><line x1="${X(0)}" y1="${Y(m)}" x2="${X(100)}" y2="${Y(m)}" style="stroke:var(--ink3);stroke-dasharray:4 4"/><circle cx="${X(Tc)}" cy="${Y(m)}" r="6" style="fill:${e.cristais > 0.05 ? "var(--warn)" : "var(--ok)"};stroke:var(--bg);stroke-width:1.5"/>` + [0, 50, 100].map((x) => T(X(x), gy + 14, x, "middle", "tx2", 10)).join("") + T(gx + gw / 2, gy + 30, "temperatura (°C)", "middle", "tx2", 10) + T(gx + 4, gy - gh - 4, "solubilidade do " + S.f + " (g por 100 g de água)", "start", "tx2", 11) + T(gx - 4, Y(mx) + 4, n2(mx, 0), "end", "tx2", 10);
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = vis("solubilidade nesta temperatura", n2(e.s, 1) + " g") + vis("dissolvido", n2(e.dissolvido, 1) + " g") + vis("cristais", n2(e.cristais, 1) + " g") + vis("a solução está", e.saturada ? "saturada" : "insaturada");
      q("[data-v=st]").innerHTML = "A curva é a quantidade máxima de sal que 100 g de água dissolvem em cada temperatura. Com o ponto <b>abaixo</b> da curva, tudo fica dissolvido. Esfrie: o ponto anda para a esquerda, cruza a curva, e o que passa do limite sai da solução como cristal. O KNO₃, com curva íngreme, rende muito cristal; o NaCl, com curva quase plana, quase nada: esfriar não serve para cristalizá-lo (é preciso evaporar a água). Aqueça de novo e os cristais se dissolvem. Curvas: dados de fonte. Modelo: o cristal aparece assim que a curva é cruzada; na prática a solução pode ficar supersaturada por um tempo. Poucos cristais grandes (devagar) ou muitos pequenos (depressa): tendência ilustrativa."; };
    liga(el, "s", (v) => { sal = v; }); q("[data-c=m]").addEventListener("input", () => { m = +q("[data-c=m]").value; }); q("[data-c=T]").addEventListener("input", () => { Tc = +q("[data-c=T]").value; esfria = 0; });
    [["le", -3, false], ["ra", -25, true], ["aq", 12, null], ["pa", 0, null]].forEach(([k, v, r]) => q(`[data-a=${k}]`).addEventListener("click", () => { esfria = v; if (r !== null && SIM.cristaliza(sal, m, Tc).cristais < 0.05) { rapido = r; semeia(); } }));
    semeia(); anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqCristal._ult = { poe: (s, mm, Tn) => { sal = s; m = mm; Tc = Tn; esfria = 0; q("[data-c=m]").value = mm; q("[data-c=T]").value = Tn; el.querySelectorAll("[data-s]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.s === s))); desenha(); }, esfria: (taxa, rap) => { esfria = taxa; rapido = !!rap; semeia(); }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); }, est }; };

  /* ---------- EQ25 · indicador de repolho roxo ---------- */
  /* [nome, pH como a fonte escreve, pH usado para a cor (meio da faixa)] */
  SIM.CASA = { limao: ["suco de limão", "2,2", 2.2], vinagre: ["vinagre", "2 a 3", 2.5], laranja: ["suco de laranja", "3,3 a 4,2", 3.75], cafe: ["café preto", "5 a 5,03", 5.0], leite: ["leite", "6,5 a 6,8", 6.65], agua: ["água pura (25 °C)", "7", 7], mar: ["água do mar", "7,5 a 8,4", 7.95], amonia: ["amoníaco", "11,0 a 11,5", 11.25], sanitaria: ["água sanitária", "12,5", 12.5], soda: ["soda cáustica", "14", 14] };
  /* cor do extrato: três faixas da fonte; dentro da faixa básica, azul → verde → amarelo (ordem da fonte; posições ilustrativas) */
  SIM.corRepolho = (pH) => { const mix = (a, b, f) => "#" + a.map((x, i) => Math.round(x + (b[i] - x) * f).toString(16).padStart(2, "0")).join(""), V = [226, 48, 62], R = [233, 86, 160], P = [128, 74, 178], A = [62, 110, 214], Ve = [70, 170, 96], Am = [214, 196, 60];
    if (pH < 6.5) return { hex: mix(V, R, Math.max(0, Math.min(1, (pH - 1) / 5.5))), nome: pH < 3.5 ? "vermelho" : "rosa", faixa: "ácida" }; if (pH <= 7.5) return { hex: mix(R, P, 0.5 + 0.5 * (pH - 6.5)), nome: "roxo", faixa: "neutra" };
    const f = (pH - 7.5) / 6.5; return { hex: f < 0.5 ? mix(A, Ve, f / 0.5) : mix(Ve, Am, (f - 0.5) / 0.5), nome: f < 0.33 ? "azul" : f < 0.67 ? "verde" : "amarelo", faixa: "básica" }; };
  /* nome: "Indicador de repolho roxo: a cor que mede o pH" · matéria: Química · tema: EQ25 */
  SIM.eqRepolho = (el, F) => { const W = 680, H = 310, IDS = Object.keys(SIM.CASA); let tubos = ["limao", "vinagre", "leite", "agua", "amonia", "sanitaria"], prog = 0, pingando = false, t = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">o que vai nos tubos (até 6)</p><div class="bts">${IDS.map((k) => `<button class="bt peq" data-s="${k}" aria-pressed="${tubos.includes(k)}">${SIM.CASA[k][0]}</button>`).join("")}</div></div>
      <div><div class="bts"><button class="bt pri" data-a="pi">Pingar o extrato de repolho</button><button class="bt" data-a="lv">Lavar os tubos</button></div><p style="margin:8px 0 0;font-size:13.5px;color:var(--ink2)">Antes de pingar: quais vão ficar vermelhos, quais roxos e quais verdes?</p></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), est = () => ({ tubos: tubos.map((k) => { const c = SIM.corRepolho(SIM.CASA[k][2]); return { id: k, nome: SIM.CASA[k][0], pH: SIM.CASA[k][1], cor: prog >= 1 ? c.nome : "sem indicador", faixa: prog >= 1 ? c.faixa : "?" }; }), prog, pingando });
    const desenha = () => { const e = est(), n = tubos.length, cw = 600 / Math.max(n, 1); let s = `<rect x="30" y="232" width="620" height="8" rx="3" style="fill:var(--ink3)"/>`;
      tubos.forEach((k, i) => { const cx = 40 + cw * (i + 0.5), c = SIM.corRepolho(SIM.CASA[k][2]), f = Math.min(1, prog);
        s += `<path d="M${cx - 16},70 v130 a16,16 0 0 0 32,0 v-130" style="fill:none;stroke:var(--ink2);stroke-width:2"/><path d="M${cx - 14},110 v90 a14,14 0 0 0 28,0 v-90 z" style="fill:#cfd8e3;opacity:.2"/><path d="M${cx - 14},110 v90 a14,14 0 0 0 28,0 v-90 z" style="fill:${c.hex};opacity:${(0.85 * f).toFixed(2)}"/>`;
        if (pingando && prog < 1) { const y = 30 + ((t * 160 + i * 17) % 76); s += `<ellipse cx="${cx}" cy="${y.toFixed(1)}" rx="3" ry="4.5" style="fill:#804ab2"/>`; }
        s += T(cx, 258, SIM.CASA[k][0], "middle", "tx", 11) + T(cx, 274, prog >= 1 ? "pH " + SIM.CASA[k][1] : "pH ?", "middle", "tx2", 10) + T(cx, 290, prog >= 1 ? c.nome : "", "middle", "tx2", 11); });
      for (let i = 0; i <= 56; i++) s += `<rect x="${(110 + i * 8.2).toFixed(1)}" y="8" width="8.4" height="10" style="fill:${SIM.corRepolho(i / 4).hex}"/>`; s += T(104, 17, "pH 0", "end", "tx2", 10) + T(576, 17, "14", "start", "tx2", 10);
      q("[data-v=sv]").innerHTML = s;
      q("[data-v=lt]").innerHTML = e.tubos.length ? e.tubos.map((x) => vis(x.nome, x.cor + (prog >= 1 ? " · " + x.faixa : ""))).join("") : vis("tubos", "escolha as substâncias");
      q("[data-v=st]").innerHTML = "O repolho roxo deve a cor às antocianinas, pigmentos cuja estrutura muda com o pH, e a cor muda junto: vermelho ou rosa em meio ácido, roxo em meio neutro, e do azul ao verde e ao amarelo em meio básico. Com um só extrato dá para separar o que é ácido, neutro e básico na cozinha. Valores de pH: tabela de soluções comuns da fonte (onde ela dá uma faixa, a cor usa o meio). As três faixas de cor são da fonte; o ponto exato em que o azul vira verde e o verde vira amarelo, na tela, é ilustrativo."; };
    el.querySelectorAll("[data-s]").forEach((b) => b.addEventListener("click", () => { const k = b.dataset.s; if (tubos.includes(k)) tubos = tubos.filter((x) => x !== k); else if (tubos.length < 6) tubos.push(k); b.setAttribute("aria-pressed", String(tubos.includes(k))); prog = 0; pingando = false; }));
    q("[data-a=pi]").addEventListener("click", () => { if (tubos.length) { pingando = true; prog = 0; } }); q("[data-a=lv]").addEventListener("click", () => { prog = 0; pingando = false; });
    const passo = (dt) => { t += dt; if (pingando && prog < 1) { prog = Math.min(1, prog + dt / 1.8); if (prog >= 1) pingando = false; } };
    anima(el, F, (dt) => { passo(dt); desenha(); });
    SIM.eqRepolho._ult = { poe: (lista) => { tubos = lista.slice(0, 6); el.querySelectorAll("[data-s]").forEach((b) => b.setAttribute("aria-pressed", String(tubos.includes(b.dataset.s)))); prog = 0; pingando = false; desenha(); }, pinga: () => { pingando = true; prog = 0; }, avanca: (seg) => { for (let i = 0; i < Math.round(seg * 60); i++) passo(1 / 60); desenha(); }, est }; };
})();
