/* Simulações da Química, módulo F (Físico-química II), parte de equilíbrio iônico: F08 a F10.
   DADOS (tools/quimica/dadosF.json, com fonte, endereço e trecho):
   SIM.AB.Ka: constantes de acidez a 25 °C do apêndice H do OpenStax Chemistry 2e (acético 1,8·10⁻⁵; fórmico 1,8·10⁻⁴; HF 6,4·10⁻⁴; HCN 4,9·10⁻¹⁰; HClO 2,9·10⁻⁸;
     HNO₂ 4,6·10⁻⁴; carbônico 4,3·10⁻⁷ e 4,7·10⁻¹¹; fosfórico 7,5·10⁻³, 6,2·10⁻⁸ e 4,2·10⁻¹³); amônia: Kb = 1,8·10⁻⁵ (apêndice I).
   SIM.AB.Kw: tabela E3 do OpenStax (0 °C 0,112·10⁻¹⁴; 50 °C 5,297·10⁻¹⁴; 100 °C 56,23·10⁻¹⁴); a 25 °C uso 1,0·10⁻¹⁴ (valor do texto; a tabela dá 0,991·10⁻¹⁴).
   SIM.AB.casa: faixas de pH de coisas do dia a dia, da tabela de exemplos da página "pH" da Wikipedia (são faixas, não valores exatos).
   SIM.KPS: produtos de solubilidade das caixas de dados da Wikipedia (25 °C; PbCl₂ e PbI₂ a 20 °C). O apêndice J do OpenStax traz números diferentes para vários sais
     (BaSO₄: 2,3·10⁻⁸ contra 1,08·10⁻¹⁰; Ag₂CrO₄: 9·10⁻¹² contra 1,12·10⁻¹²): a tela avisa que Kps varia de tabela para tabela.
   CONTAS: SIM.phGeral resolve o balanço de carga exato (com a autoionização da água) por bisseção em log[H⁺]:
     [H⁺] + cb + CB·[H⁺]/(KaB + [H⁺]) = Kw/[H⁺] + ca + CT·Ka/(Ka + [H⁺]),
     com ca = ânion de ácido forte, cb = cátion de base forte, CT = total do par HA/A⁻, CB = total do par BH⁺/B (KaB = Kw/Kb).
   Conferido em Python por outro método (tools/quimica/confere-acidobase.py): HCl 0,010 → 2,000; HCl 10⁻⁸ → 6,978; acético 0,10 → 2,875; amônia 0,10 → 11,125;
     tampão acético 0,10/0,10 → 4,745; + 0,010 mol de HCl por litro → 4,658; acetato de sódio 0,10 → 8,872; NH₄Cl 0,10 → 5,128. */
(function () {
  const SIM = (window.SIM = window.SIM || {});
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const botoes = (lista, attr, ativo) => lista.map(([k, nome]) => `<button class="bt peq" data-${attr}="${k}" aria-pressed="${String(k) === String(ativo)}">${nome}</button>`).join("");
  const liga = (el, attr, fn) => el.querySelectorAll(`[data-${attr}]`).forEach((b) => b.addEventListener("click", () => { el.querySelectorAll(`[data-${attr}]`).forEach((x) => x.setAttribute("aria-pressed", x === b)); fn(b.dataset[attr]); }));
  const nf = (v, d = 2) => (!isFinite(v) ? "—" : (+v).toFixed(d).replace(".", ",").replace("-", "−"));
  const sl = (rot, c, min, max, passo, val) => `<div class="ctrl"><label>${rot}</label><input type="range" min="${min}" max="${max}" step="${passo}" value="${val}" data-c="${c}"><output data-o="${c}"></output></div>`;
  const anima = (el, F, fn) => { let vivo = true, ult = null; const laco = (ts) => { if (!vivo) return; const dt = ult === null ? 0 : Math.min(0.05, (ts - ult) / 1000); ult = ts; fn(dt); requestAnimationFrame(laco); }; requestAnimationFrame(laco); F.aoSair(() => (vivo = false)); };
  const f1 = (x) => x.toFixed(1);
  const SUP = (n) => String(n).split("").map((c) => ({ "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" })[c]).join("");
  /* notação científica em texto: 1,8·10⁻⁵ */
  const sci = (SIM.sci10 = (v, d = 1) => { if (!(v > 0)) return "0"; let e = Math.floor(Math.log10(v)), m = v / Math.pow(10, e); if (+m.toFixed(d) >= 10) { m /= 10; e += 1; } return e === 0 ? nf(m, d) : `${nf(m, d)}·10${SUP(e)}`; });

  const AB = (SIM.AB = {
    Ka: { acetico: 1.8e-5, formico: 1.8e-4, HF: 6.4e-4, HCN: 4.9e-10, HClO: 2.9e-8, HNO2: 4.6e-4, carbonico1: 4.3e-7, carbonico2: 4.7e-11, fosforico1: 7.5e-3, fosforico2: 6.2e-8, fosforico3: 4.2e-13 },
    Kb: { amonia: 1.8e-5 },
    Kw: { 0: 0.112e-14, 25: 1.0e-14, 50: 5.297e-14, 100: 56.23e-14 },
    casa: [["suco gástrico", 1.0, 1.5], ["vinagre", 2, 3], ["suco de laranja", 3.3, 4.2], ["leite", 6.5, 6.8], ["sangue", 7.35, 7.45], ["água do mar", 7.5, 8.4], ["amoníaco de limpeza", 11.0, 11.5]],
  });
  SIM.phGeral = (o) => { const ca = o.ca || 0, cb = o.cb || 0, CT = o.CT || 0, Ka = o.Ka || 1, CB = o.CB || 0, KaB = o.KaB || 1, Kw = o.Kw || 1e-14;
    const f = (h) => h + cb + (CB * h) / (KaB + h) - Kw / h - ca - (CT * Ka) / (Ka + h); let lo = -16, hi = 1.5;
    for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; f(Math.pow(10, m)) > 0 ? (hi = m) : (lo = m); } const h = Math.pow(10, (lo + hi) / 2); return { h, oh: Kw / h, pH: -Math.log10(h), pOH: -Math.log10(Kw / h), pKw: -Math.log10(Kw) }; };
  /* solução de um soluto só: tipo = agua | forteA | forteB | fracoA (Ka) | fracoB (Kb) */
  SIM.phSol = (tipo, C, K, Kw = 1e-14) => { const o = { Kw }; if (tipo === "forteA") o.ca = C; if (tipo === "forteB") o.cb = C; if (tipo === "fracoA") { o.CT = C; o.Ka = K; } if (tipo === "fracoB") { o.CB = C; o.KaB = Kw / K; } const r = SIM.phGeral(o);
    r.alfa = tipo === "fracoA" ? K / (K + r.h) : tipo === "fracoB" ? r.h / (Kw / K + r.h) : tipo === "agua" ? null : 1; return r; };
  /* tampão HA/A⁻ (ou BH⁺/B com Ka = Kw/Kb): na mols da forma ácida, nb da forma básica, em V litros; forte = mols de H⁺ forte (negativo = OH⁻) */
  SIM.phTampao = (Ka, na, nb, V, forte = 0, Kw = 1e-14) => SIM.phGeral({ CT: (na + nb) / V, Ka, cb: nb / V + Math.max(0, -forte) / V, ca: Math.max(0, forte) / V, Kw });

  /* ---------- F08 · escala de pH ---------- */
  /* nome: "Escala de pH: escolha a solução e dilua" · matéria: Química · tema: F08 */
  SIM.qPH = (el, F) => {
    const W = 700, H = 245, SOL = { agua: ["água pura", "agua"], HCl: ["HCl (ácido forte)", "forteA"], HAc: ["ácido acético (fraco)", "fracoA", AB.Ka.acetico], NaOH: ["NaOH (base forte)", "forteB"], NH3: ["amônia (base fraca)", "fracoB", AB.Kb.amonia] }; let k = "HCl", lc = -2, T = 25;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(Object.keys(SOL).map((x) => [x, SOL[x][0]]), "k", k)}</div></div><div>${sl("Concentração (mol/L)", "lc", -9, 0, 0.25, lc)}<div class="bts" style="margin-top:8px">${botoes([[0, "0 °C"], [25, "25 °C"], [50, "50 °C"], [100, "100 °C"]], "t", T)}</div></div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s), fraco = () => SOL[k][1].startsWith("fraco");
    const marcaT = () => el.querySelectorAll("[data-t]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.t === T));
    liga(el, "k", (v) => { k = v; if (fraco() && T !== 25) { T = 25; marcaT(); } }); liga(el, "t", (v) => { T = +v; if (fraco() && T !== 25) { T = 25; marcaT(); } }); q("[data-c=lc]").addEventListener("input", (e) => (lc = +e.target.value));
    const est = () => { const C = Math.pow(10, lc), r = SIM.phSol(SOL[k][1], C, SOL[k][2], AB.Kw[T]); return { k, C, T, ...r, neutro: r.pKw / 2, ingenuo: SOL[k][1] === "forteA" ? -Math.log10(C) : SOL[k][1] === "forteB" ? r.pKw + Math.log10(C) : null }; };
    SIM.qPH._ult = { poe: (kk, l, t) => { k = kk; lc = l; T = t; q("[data-c=lc]").value = l; el.querySelectorAll("[data-k]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.k === k)); marcaT(); }, est };
    anima(el, F, () => { const e = est(); q("[data-o=lc]").textContent = sci(e.C, 1);
      const x0 = 50, w = 600, y = 70, X = (p) => x0 + (Math.max(0, Math.min(14, p)) / 14) * w;
      let h = `<defs><linearGradient id="gph" x1="0" x2="1"><stop offset="0" stop-color="#e5484d"/><stop offset=".3" stop-color="#f0a13a"/><stop offset=".5" stop-color="#5fbf73"/><stop offset=".72" stop-color="#4a8fe8"/><stop offset="1" stop-color="#7a4fd0"/></linearGradient></defs><rect x="${x0}" y="${y}" width="${w}" height="26" rx="5" style="fill:url(#gph);opacity:.85"/>`;
      for (let p = 0; p <= 14; p++) h += `<line x1="${f1(X(p))}" y1="${y + 26}" x2="${f1(X(p))}" y2="${y + 32}" style="stroke:var(--ink2)"/>` + D.txt(X(p), y + 46, String(p), "tx2");
      h += `<line x1="${f1(X(e.neutro))}" y1="${y - 8}" x2="${f1(X(e.neutro))}" y2="${y + 34}" style="stroke:var(--ink);stroke-width:1.6;stroke-dasharray:3 3"/>` + D.txt(X(e.neutro), y - 14, `neutro a ${T} °C: ${nf(e.neutro, 2)}`, "tx2");
      h += `<path d="M${f1(X(e.pH))} ${y - 2}l-8 -16h16z" style="fill:var(--ink)"/>` + D.txt(X(e.pH), y - 44, "pH " + nf(e.pH, 2), "tx", "middle", 'style="font-weight:700"');
      /* coisas do dia a dia (faixas) */
      AB.casa.forEach((c, i) => { const yy = 140 + (i % 3) * 30; h += `<rect x="${f1(X(c[1]))}" y="${yy}" width="${f1(Math.max(4, X(c[2]) - X(c[1])))}" height="7" rx="3" style="fill:var(--ink3)"/>` + D.txt((X(c[1]) + X(c[2])) / 2, yy + 22, c[0], "tx2"); });
      q("[data-v=sv]").innerHTML = h;
      q("[data-v=lt]").innerHTML = vis("[H⁺]", sci(e.h, 2) + " mol/L") + vis("[OH⁻]", sci(e.oh, 2) + " mol/L") + vis("pH", nf(e.pH, 2)) + vis("pOH", nf(e.pOH, 2)) + vis("pH + pOH", nf(e.pKw, 2)) + (e.alfa !== null && fraco() ? vis("ionizado", nf(100 * e.alfa, e.alfa < 0.1 ? 2 : 1) + "%") : "");
      const dif = e.ingenuo !== null && Math.abs(e.ingenuo - e.pH) > 0.05;
      q("[data-v=st]").innerHTML = (k === "agua" ? `Água pura: [H⁺] = [OH⁻] = √Kw. A ${T} °C o pH neutro é ${nf(e.neutro, 2)}${T !== 25 ? ", e não 7: a água continua neutra, porque neutro quer dizer [H⁺] = [OH⁻]. Quem muda é o Kw." : "."}` : fraco() ? `Eletrólito fraco: só ${nf(100 * e.alfa, e.alfa < 0.1 ? 2 : 1)}% das moléculas estão ionizadas. Dilua e veja a porcentagem ionizada <b>subir</b> (lei da diluição de Ostwald), embora o pH se aproxime de 7. As constantes dos fracos são as de 25 °C, por isso a temperatura fica presa em 25 °C aqui.` : `Eletrólito forte: ioniza por completo, e cada diluição de 10 vezes muda o pH em 1 unidade.`) + (dif ? ` <b>Atenção:</b> a conta direta daria pH ${nf(e.ingenuo, 2)}, do lado errado ou longe do neutro. Em solução tão diluída, o H⁺ e o OH⁻ da própria água passam a contar, e o pH fica preso perto do neutro: diluir um ácido nunca o transforma em base.` : "") + " As barrinhas de baixo são faixas de pH de tabela, não valores exatos."; });
  };

  /* ---------- F09 · tampão ---------- */
  /* nome: "Tampão: pingue ácido ou base e veja o pH resistir" · matéria: Química · tema: F09 */
  SIM.qTampao = (el, F) => {
    const W = 700, H = 250, PAR = { ac: ["ácido acético / acetato", AB.Ka.acetico, "HAc", "Ac⁻"], am: ["amônio / amônia", 1e-14 / AB.Kb.amonia, "NH₄⁺", "NH₃"] }; let par = "ac", na = 0.1, nb = 0.1, forte = 0, hist = [];
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(Object.keys(PAR).map((x) => [x, PAR[x][0]]), "p", par)}</div><div class="bts" style="margin-top:8px"><button class="bt peq" data-a="h">+ 0,010 mol de HCl</button><button class="bt peq" data-a="oh">+ 0,010 mol de NaOH</button><button class="bt peq" data-a="zera">recomeçar</button></div></div>
        <div>${sl("Forma ácida (mol)", "na", 0, 0.5, 0.01, na)}${sl("Forma básica (mol)", "nb", 0, 0.5, 0.01, nb)}</div></div>
      <div class="status" data-v="st">São dois frascos de 1,0 L: um com <b>água pura</b> e outro com o <b>tampão</b>. Cada clique acrescenta 0,010 mol de ácido forte ou de base forte aos dois. A água despenca vários pontos de pH; o tampão quase não se mexe, até que uma das formas acabe. Zere a forma ácida para ver só o sal em água: o pH que aparece é o da <b>hidrólise</b>.</div>`);
    const q = (s) => el.querySelector(s), Ka = () => PAR[par][1];
    const est = () => { const t = SIM.phTampao(Ka(), na, nb, 1, forte), a = SIM.phGeral({ ca: Math.max(0, forte), cb: Math.max(0, -forte) }), na2 = na + forte, nb2 = nb - forte, hh = na2 > 0 && nb2 > 0 ? -Math.log10(Ka()) + Math.log10(nb2 / na2) : null; return { par, na, nb, forte, pH: t.pH, agua: a.pH, pKa: -Math.log10(Ka()), hh, na2, nb2, estourou: na2 <= 0 || nb2 <= 0 }; };
    const marca = () => { const e = est(); hist.push([forte, e.pH, e.agua]); if (hist.length > 80) hist.shift(); };
    const zera = () => { forte = 0; hist = []; marca(); };
    liga(el, "p", (v) => { par = v; zera(); }); q("[data-c=na]").addEventListener("input", (e) => { na = +e.target.value; zera(); }); q("[data-c=nb]").addEventListener("input", (e) => { nb = +e.target.value; zera(); });
    el.addEventListener("click", (e) => { const b = e.target.closest("[data-a]"); if (!b) return; if (b.dataset.a === "zera") return zera(); forte = Math.round((forte + (b.dataset.a === "h" ? 0.01 : -0.01)) * 1000) / 1000; forte = Math.max(-0.6, Math.min(0.6, forte)); marca(); });
    SIM.qTampao._ult = { poe: (p, a, b, f) => { par = p; na = a; nb = b; forte = f; hist = []; marca(); q("[data-c=na]").value = a; q("[data-c=nb]").value = b; el.querySelectorAll("[data-p]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.p === par)); }, est };
    zera();
    anima(el, F, () => { const e = est(); q("[data-o=na]").textContent = nf(na, 2) + " mol"; q("[data-o=nb]").textContent = nf(nb, 2) + " mol";
      const cor = (p) => `hsl(${Math.round(Math.max(0, Math.min(14, p)) * 19)},65%,52%)`;
      const frasco = (x, p, rot) => `<rect x="${x}" y="50" width="110" height="120" rx="6" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="${x + 2}" y="80" width="106" height="88" rx="4" style="fill:${cor(p)};opacity:.5"/>` + D.txt(x + 55, 36, rot, "tx2") + D.txt(x + 55, 130, "pH " + nf(p, 2), "tx", "middle", 'style="font-weight:700"');
      let h = frasco(40, e.agua, "água pura") + frasco(180, e.pH, "tampão");
      /* gráfico pH × ácido forte acrescentado */
      const gx = 360, gy = 215, gw = 300, gh = 180, X = (f) => gx + ((f + 0.3) / 0.6) * gw, Y = (p) => gy - (Math.max(0, Math.min(14, p)) / 14) * gh;
      h += D.seta(gx, gy, gx + gw + 10, gy, "var(--ink2)", 1.3) + D.seta(gx, gy, gx, gy - gh - 12, "var(--ink2)", 1.3) + D.txt(gx + 10, gy - gh - 4, "pH", "tx2", "start") + D.txt(gx + gw / 2, gy + 30, "← base forte (mol) · ácido forte (mol) →", "tx2") + `<line x1="${X(0)}" y1="${gy}" x2="${X(0)}" y2="${gy - gh}" style="stroke:var(--ink3);stroke-dasharray:3 4"/>`;
      [0, 7, 14].forEach((p) => (h += D.txt(gx - 8, Y(p) + 4, String(p), "tx2", "end")));
      [-0.3, -0.1, 0.1, 0.3].forEach((f) => (h += D.txt(X(f), gy + 14, nf(Math.abs(f), 1), "tx2")));
      let dt = "", da = ""; for (let f = -0.3; f <= 0.3001; f += 0.005) { const t = SIM.phTampao(Ka(), na, nb, 1, f), a = SIM.phGeral({ ca: Math.max(0, f), cb: Math.max(0, -f) }); dt += (dt ? "L" : "M") + f1(X(f)) + " " + f1(Y(t.pH)); da += (da ? "L" : "M") + f1(X(f)) + " " + f1(Y(a.pH)); }
      h += `<path d="${da}" style="fill:none;stroke:var(--ink3);stroke-width:1.8"/><path d="${dt}" style="fill:none;stroke:var(--mod);stroke-width:2.6"/>`;
      if (Math.abs(forte) <= 0.3) h += `<circle cx="${f1(X(forte))}" cy="${f1(Y(e.pH))}" r="6" style="fill:var(--mod);stroke:var(--bg);stroke-width:2"/><circle cx="${f1(X(forte))}" cy="${f1(Y(e.agua))}" r="5" style="fill:var(--ink3);stroke:var(--bg);stroke-width:2"/>`;
      h += D.txt(gx + gw - 4, gy - gh + 4, "tampão", "tx2", "end", 'style="fill:var(--mod)"') + D.txt(gx + gw - 4, gy - gh + 20, "água pura", "tx2", "end");
      q("[data-v=sv]").innerHTML = h;
      q("[data-v=lt]").innerHTML = vis("pKa do par", nf(e.pKa, 2)) + vis(PAR[par][2] + " agora", nf(Math.max(0, e.na2), 3) + " mol") + vis(PAR[par][3] + " agora", nf(Math.max(0, e.nb2), 3) + " mol") + vis("pH pela fórmula", e.hh === null ? "não vale" : nf(e.hh, 2)) + vis("pH exato", nf(e.pH, 2)) + vis("forte acrescentado", (forte >= 0 ? nf(forte, 3) + " mol H⁺" : nf(-forte, 3) + " mol OH⁻")); });
  };

  /* ---------- F10 · produto de solubilidade ---------- */
  /* [fórmula em texto, cátion, ânion, a (cátions por fórmula), b (ânions), Kps] */
  SIM.KPS = { AgCl: ["AgCl", "Ag⁺", "Cl⁻", 1, 1, 1.77e-10], AgBr: ["AgBr", "Ag⁺", "Br⁻", 1, 1, 5.4e-13], AgI: ["AgI", "Ag⁺", "I⁻", 1, 1, 8.52e-17], BaSO4: ["BaSO₄", "Ba²⁺", "SO₄²⁻", 1, 1, 1.0842e-10], CaCO3: ["CaCO₃", "Ca²⁺", "CO₃²⁻", 1, 1, 3.3e-9], CaF2: ["CaF₂", "Ca²⁺", "F⁻", 1, 2, 3.9e-11], PbI2: ["PbI₂", "Pb²⁺", "I⁻", 1, 2, 4.41e-9], PbCl2: ["PbCl₂", "Pb²⁺", "Cl⁻", 1, 2, 1.7e-5], Ag2CrO4: ["Ag₂CrO₄", "Ag⁺", "CrO₄²⁻", 2, 1, 1.12e-12], MgOH2: ["Mg(OH)₂", "Mg²⁺", "OH⁻", 1, 2, 5.61e-12], CaOH2: ["Ca(OH)₂", "Ca²⁺", "OH⁻", 1, 2, 5.02e-6], FeOH3: ["Fe(OH)₃", "Fe³⁺", "OH⁻", 1, 3, 2.79e-39], CaSO4: ["CaSO₄", "Ca²⁺", "SO₄²⁻", 1, 1, 4.93e-5] };
  SIM.kps = {
    /* solubilidade molar em água pura: Kps = (a·s)^a (b·s)^b */
    s: (k) => { const [, , , a, b, K] = SIM.KPS[k]; return Math.pow(K / (Math.pow(a, a) * Math.pow(b, b)), 1 / (a + b)); },
    Q: (k, c1, c2) => { const [, , , a, b] = SIM.KPS[k]; return Math.pow(c1, a) * Math.pow(c2, b); },
    /* mistura com c1 (cátion) e c2 (ânion): se Q > Kps precipitam x mol/L de fórmulas até (c1 − a·x)^a (c2 − b·x)^b = Kps */
    precip: (k, c1, c2) => { const [, , , a, b, K] = SIM.KPS[k], Q = SIM.kps.Q(k, c1, c2); if (Q <= K) return { Q, K, x: 0, c1, c2, ppt: false }; let lo = 0, hi = Math.min(c1 / a, c2 / b);
      for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; Math.pow(c1 - a * m, a) * Math.pow(c2 - b * m, b) > K ? (lo = m) : (hi = m); } const x = (lo + hi) / 2; return { Q, K, x, c1: c1 - a * x, c2: c2 - b * x, ppt: true }; },
    /* solubilidade com íon comum: ânion já presente com concentração c (ou cátion, se qual = "cat") */
    comum: (k, c, qual = "an") => { const [, , , a, b, K] = SIM.KPS[k]; let lo = 0, hi = SIM.kps.s(k); for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, p = qual === "an" ? Math.pow(a * m, a) * Math.pow(c + b * m, b) : Math.pow(c + a * m, a) * Math.pow(b * m, b); p > K ? (hi = m) : (lo = m); } return (lo + hi) / 2; },
  };
  /* nome: "Kps: misture os íons e veja se precipita" · matéria: Química · tema: F10 */
  SIM.qKps = (el, F) => {
    const W = 700, H = 240, LISTA = ["AgCl", "BaSO4", "CaF2", "PbI2", "Ag2CrO4", "MgOH2"]; let k = "AgCl", l1 = -4, l2 = -4, tt = 0;
    el.insertAdjacentHTML("beforeend", `<div class="palco"><svg viewBox="0 0 ${W} ${H}" width="${W}" data-v="sv"></svg></div><div class="leitor" data-v="lt"></div>
      <div class="ctrls"><div><div class="bts">${botoes(LISTA.map((x) => [x, SIM.KPS[x][0]]), "k", k)}</div></div><div>${sl("Cátion (mol/L)", "l1", -8, -1, 0.25, l1)}${sl("Ânion (mol/L)", "l2", -8, -1, 0.25, l2)}</div></div>
      <div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    liga(el, "k", (v) => (k = v)); q("[data-c=l1]").addEventListener("input", (e) => (l1 = +e.target.value)); q("[data-c=l2]").addEventListener("input", (e) => (l2 = +e.target.value));
    const est = () => { const c1 = Math.pow(10, l1), c2 = Math.pow(10, l2), r = SIM.kps.precip(k, c1, c2); return { k, i1: c1, i2: c2, ...r, s: SIM.kps.s(k) }; };
    SIM.qKps._ult = { poe: (kk, a, b) => { k = kk; l1 = a; l2 = b; q("[data-c=l1]").value = a; q("[data-c=l2]").value = b; el.querySelectorAll("[data-k]").forEach((x) => x.setAttribute("aria-pressed", x.dataset.k === k)); }, est };
    anima(el, F, (dt) => { tt += dt; const e = est(), d = SIM.KPS[k]; q("[data-o=l1]").textContent = sci(e.i1, 1); q("[data-o=l2]").textContent = sci(e.i2, 1);
      const bx = 60, by = 40, bw = 180, bh = 160, lq = Math.log10(e.Q / e.K), turvo = e.ppt ? Math.min(0.75, 0.15 + 0.12 * Math.max(0, Math.log10(e.x) + 8)) : 0, fundo = e.ppt ? Math.min(40, 4 + 5 * Math.max(0, Math.log10(e.x) + 8)) : 0;
      let h = `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="6" style="fill:none;stroke:var(--ink2);stroke-width:2"/><rect x="${bx + 2}" y="${by + 26}" width="${bw - 4}" height="${bh - 28}" rx="4" style="fill:rgba(90,150,230,.22)"/>` + (e.ppt ? `<rect x="${bx + 2}" y="${by + 26}" width="${bw - 4}" height="${bh - 28}" rx="4" style="fill:rgba(235,235,225,${turvo.toFixed(2)})"/><rect x="${bx + 2}" y="${f1(by + bh - 2 - fundo)}" width="${bw - 4}" height="${f1(fundo)}" rx="3" style="fill:rgba(240,240,232,.92)"/>` : "");
      if (e.ppt) for (let i = 0; i < 14; i++) { const px = bx + 14 + ((i * 47) % (bw - 28)), py = by + 34 + ((i * 31 + tt * 22) % (bh - 50 - fundo)); h += `<circle cx="${px}" cy="${f1(py)}" r="2.2" style="fill:rgba(250,250,245,.9)"/>`; }
      h += D.txt(bx + bw / 2, by + bh + 22, e.ppt ? `precipita ${d[0]}` : "solução límpida", "tx2", "middle", `style="font-weight:700;fill:${e.ppt ? "var(--warn)" : "var(--ok)"}"`);
      /* barra log Q/Kps */
      const x0 = 310, w = 340, y = 110, X = (v) => x0 + ((Math.max(-8, Math.min(8, v)) + 8) / 16) * w;
      h += `<rect x="${x0}" y="${y - 10}" width="${w / 2}" height="20" style="fill:rgba(60,180,110,.14)"/><rect x="${x0 + w / 2}" y="${y - 10}" width="${w / 2}" height="20" style="fill:rgba(240,160,60,.16)"/><line x1="${x0 + w / 2}" y1="${y - 22}" x2="${x0 + w / 2}" y2="${y + 22}" style="stroke:var(--ok);stroke-width:3"/><circle cx="${f1(X(lq))}" cy="${y}" r="7" style="fill:var(--warn);stroke:var(--bg);stroke-width:2"/>` + D.txt(x0 + w / 2, y - 30, "Kps", "tx2", "middle", 'style="fill:var(--ok);font-weight:700"') + D.txt(X(lq), y + 40, "Q", "tx2", "middle", 'style="fill:var(--warn);font-weight:700"') + D.txt(x0 + 6, y + 62, "Q < Kps: cabe mais (insaturada)", "tx2", "start") + D.txt(x0 + w - 6, y + 82, "Q > Kps: passa do limite (precipita)", "tx2", "end");
      h += D.txt(x0 + w / 2, 40, `${d[0]}(s) ⇌ ${d[3] > 1 ? d[3] + " " : ""}${d[1]} + ${d[4] > 1 ? d[4] + " " : ""}${d[2]}`, "tx2", "middle", 'style="font-weight:700"') + D.txt(x0 + w / 2, 60, `Kps = [${d[1]}]${d[3] > 1 ? SUP(d[3]) : ""}[${d[2]}]${d[4] > 1 ? SUP(d[4]) : ""} = ${sci(d[5], 2)}`, "tx2");
      q("[data-v=sv]").innerHTML = h;
      q("[data-v=lt]").innerHTML = vis("Q inicial", sci(e.Q, 1)) + vis("Kps", sci(e.K, 2)) + vis("precipitou", e.ppt ? sci(e.x, 1) + " mol/L" : "nada") + vis(`[${d[1]}] final`, sci(e.c1, 1)) + vis(`[${d[2]}] final`, sci(e.c2, 1)) + vis("solubilidade em água pura", sci(e.s, 1) + " mol/L");
      q("[data-v=st]").innerHTML = (e.ppt ? `Q passou do Kps: forma-se sólido até as concentrações que sobram darem de novo Q = Kps. Repare que o íon em <b>falta</b> quase some da solução, e o outro fica em excesso.` : `Q está abaixo do Kps: a solução aguenta esses íons sem precipitar. Aumente uma das concentrações até a bolinha cruzar a linha verde.`) + ` Os expoentes do Kps são os coeficientes: por isso sais 1:2 como ${SIM.KPS.CaF2[0]} respondem muito mais ao ânion que ao cátion. Os valores de Kps são de uma tabela (caixas de dados da Wikipedia); outras tabelas trazem números diferentes, e em prova vale sempre o do enunciado.`; });
  };
})();
