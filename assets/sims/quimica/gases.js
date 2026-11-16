/* Simulações da Química, módulo E (Físico-química I), parte dos gases: E01 a E04.
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
})();
