/* Tabela periódica: FERRAMENTA DE RODAPÉ (β 5.3), pedida pelo Lucas em 15/11/2026.
   - Interruptor ao lado do título da matéria (páginas iniciais da Química); ao passar o mouse: "ativar tabela periódica".
   - Ligada: barra fina no rodapé, na largura inteira da tela, sempre visível. Clicar na barra faz a tabela subir; clicar de novo, no X ou Esc faz descer.
   - Depois da primeira vez, o interruptor aparece também no painel da engrenagem, abaixo das calculadoras, e a ferramenta vale em qualquer matéria.
   - Só UMA ferramenta de rodapé por vez: ligar a tabela desliga as calculadoras e vice-versa.
   Os DADOS dos elementos ficam em assets/tabela-dados.js (window.TABELA_DADOS), separados deste código: é lá que se corrige um valor.
   Valor ausente (null) aparece como "sem dado": nunca é inventado aqui. Nomes em português: SIM.ELEM (assets/sims/quimica/atomistica.js).
   Salvo em fisica:tabela (ligada?) e fisica:tabela-usada (já foi ligada alguma vez?); as configurações do site inteiro ficam no prefixo fisica:.
   Tudo o que este arquivo põe na página (barra, gaveta, interruptores e estilo) é criado aqui: no index.html só há as duas linhas de <script>. */
(function () {
  const T = (window.TABELA = {});
  const K_ON = "fisica:tabela", K_USO = "fisica:tabela-usada";
  const le = (k) => { try { return JSON.parse(localStorage.getItem(k) || "false"); } catch (e) { return false; } };
  const grava = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const D = () => window.TABELA_DADOS || { elementos: [], fontes: [], estrelas: [], mendeleiev: [] };
  const EL = (z) => D().elementos[z - 1] || null;
  const nome = (z) => (window.SIM && SIM.ELEM && SIM.ELEM.nome && SIM.ELEM.nome[z - 1]) || (EL(z) ? EL(z).s : "");
  const nf = (v, d) => (v === null || v === undefined ? "sem dado" : (+v).toLocaleString("pt-BR", { maximumFractionDigits: d === undefined ? 3 : d }).replace("-", "−"));
  const pode = () => !window.ACESSO || ACESSO.materia("quimica");

  /* ---------- posição, bloco e família (só geometria da tabela, não são dados medidos) ---------- */
  T.pos = (z) => { /* [linha 1–10, coluna 1–18]; lantanídeos (57–71) na linha 9 e actinídeos (89–103) na linha 10, colunas 3–17 */
    if (z >= 57 && z <= 71) return [9, z - 54]; if (z >= 89 && z <= 103) return [10, z - 86];
    const ini = [1, 3, 11, 19, 37, 55, 87], tam = [2, 8, 8, 18, 18, 32, 32]; let p = 6; while (z < ini[p]) p--; const k = z - ini[p];
    if (p === 0) return [1, k ? 18 : 1]; if (p < 3) return [p + 1, k < 2 ? k + 1 : k + 11]; if (p < 5) return [p + 1, k + 1]; return [p + 1, k < 2 ? k + 1 : k - 14 + 1]; };
  T.grupo = (z) => (z >= 57 && z <= 71) || (z >= 89 && z <= 103) ? null : T.pos(z)[1];
  T.periodo = (z) => (z >= 57 && z <= 71 ? 6 : z >= 89 && z <= 103 ? 7 : T.pos(z)[0]);
  T.bloco = (z) => { if (z === 2) return "s"; if ((z >= 57 && z <= 70) || (z >= 89 && z <= 102)) return "f"; if (z === 71 || z === 103) return "d"; const g = T.pos(z)[1]; return g <= 2 ? "s" : g >= 13 ? "p" : "d"; };
  const FAM = [["alc", "alcalinos", (z) => T.grupo(z) === 1 && z > 1], ["alct", "alcalinoterrosos", (z) => T.grupo(z) === 2], ["hal", "halogênios", (z) => T.grupo(z) === 17], ["nob", "gases nobres", (z) => T.grupo(z) === 18],
    ["tra", "metais de transição", (z) => { const g = T.grupo(z); return (g >= 3 && g <= 12) || z === 71 || z === 103; }], ["lan", "lantanídeos", (z) => z >= 57 && z <= 71], ["act", "actinídeos", (z) => z >= 89 && z <= 103],
    ["met", "metais", (z) => EL(z) && EL(z).tipo === "metal"], ["ame", "ametais", (z) => EL(z) && EL(z).tipo === "ametal"], ["sem", "semimetais", (z) => EL(z) && EL(z).tipo === "semimetal"]];
  const PROP = [["raio", "raio atômico", "pm", 0], ["en", "eletronegatividade", "", 2], ["ei", "energia de ionização", "eV", 3], ["ae", "afinidade eletrônica", "eV", 3], ["dens", "densidade", "g/cm³", 3], ["pf", "ponto de fusão", "K", 1], ["pe", "ponto de ebulição", "K", 1]];
  const CORB = { s: "#5b9cf5", p: "#e8b04b", d: "#4cc38a", f: "#c58af9" };

  /* ---------- distribuição eletrônica: regra de Madelung (prevista) e comparação com a medida (dados) ---------- */
  const ORDEM = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"], CAP = { s: 2, p: 6, d: 10, f: 14 }, NOBRES = { He: 2, Ne: 10, Ar: 18, Kr: 36, Xe: 54, Rn: 86 };
  T.madelung = (z) => { const o = []; let r = z; for (const sub of ORDEM) { if (r <= 0) break; const q = Math.min(r, CAP[sub[1]]); o.push([sub, q]); r -= q; } return o; };
  T.expande = (conf) => { /* "[Ar] 4s1 3d5" → {"1s":2,…} ; null se não der para ler */
    if (!conf) return null; const m = {}; let s = conf.trim(); const c = s.match(/^\[(\w+)\]\s*/); if (c) { if (!NOBRES[c[1]]) return null; T.madelung(NOBRES[c[1]]).forEach(([a, q]) => (m[a] = q)); s = s.slice(c[0].length); }
    for (const p of s.split(/\s+/).filter(Boolean)) { const k = p.match(/^(\d[spdf])(\d+)$/); if (!k) return null; m[k[1]] = +k[2]; } return m; };
  T.excecao = (z) => { const real = T.expande(EL(z) && EL(z).conf); if (!real) return null; const prev = {}; T.madelung(z).forEach(([a, q]) => (prev[a] = q)); const ks = new Set(Object.keys(real).concat(Object.keys(prev))); for (const k of ks) if ((real[k] || 0) !== (prev[k] || 0)) return true; return false; };
  const sobre = (n) => String(n).split("").map((c) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]).join("");
  const confTxt = (lista) => lista.map(([a, q]) => a + sobre(q)).join(" ");
  const confBonita = (c) => (c ? c.replace(/(\d[spdf])(\d+)/g, (_, a, q) => a + sobre(q)) : "sem dado");

  /* ---------- estado a uma temperatura (K) ---------- */
  T.estado = (z, temp) => { const e = EL(z); if (!e || (e.pf === null && e.pe === null)) return null; if (e.pf !== null && e.pe !== null && e.pf > e.pe) return temp < e.pe ? "sólido" : "gás"; /* sublima */
    if (e.pf !== null && temp < e.pf) return "sólido"; if (e.pe !== null && temp >= e.pe) return "gás"; if (e.pf !== null && e.pe !== null) return "líquido"; return null; };

  /* ---------- estilo (injetado) ---------- */
  const CSS = `
  .tp-sw{vertical-align:middle;margin-left:14px;transform:scale(.82);opacity:.75}.tp-sw:hover{opacity:1}
  body.tp-on{padding-bottom:34px}
  .tp-barra{position:fixed;left:0;right:0;bottom:0;height:32px;z-index:52;display:flex;align-items:center;gap:12px;padding:0 16px;border:0;border-top:1px solid var(--line2);background:var(--card);color:var(--ink2);font:600 13px var(--f-text);cursor:pointer;width:100%;text-align:left}
  .tp-barra:hover{color:var(--ink);background:color-mix(in srgb,var(--mod) 8%,var(--card))}
  .tp-barra svg{flex:none}.tp-barra .tp-seta{margin-left:auto;font-size:11px;transition:transform .3s}.tp-aberta .tp-barra .tp-seta{transform:rotate(180deg)}
  .tp-gaveta{position:fixed;left:0;right:0;bottom:32px;z-index:51;height:min(calc(100vh - 32px - 56px),720px);background:var(--bg);border-top:1px solid var(--line2);box-shadow:0 -10px 40px rgba(0,0,0,.45);transform:translateY(calc(100% + 40px));transition:transform .4s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;visibility:hidden}
  .tp-aberta .tp-gaveta{transform:none;visibility:visible}
  .tp-topo{display:flex;align-items:center;gap:8px;padding:8px 14px;border-bottom:1px solid var(--line);flex-wrap:wrap}
  .tp-topo b{font:700 15px var(--f-text);margin-right:6px}.tp-topo input[type=search]{width:190px;padding:5px 9px;border-radius:8px;border:1px solid var(--line2);background:var(--bg2);color:var(--ink);font:14px var(--f-text)}
  .tp-modos{display:flex;gap:5px;flex-wrap:wrap;flex:1}.tp-modos .bt{font-size:12.5px;padding:4px 9px}
  .tp-x{margin-left:auto;border:0;background:var(--bg2);color:var(--ink);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:15px}.tp-x:hover{background:var(--line2)}
  .tp-corpo{flex:1;display:flex;gap:14px;padding:10px 14px;min-height:0}
  .tp-esq{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px}.tp-ctl{min-height:42px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;font:13px var(--f-text);color:var(--ink2)}
  .tp-ctl input[type=range]{width:300px}.tp-ctl select{padding:4px 8px;border-radius:8px;border:1px solid var(--line2);background:var(--bg2);color:var(--ink);font:13px var(--f-text)}
  .tp-ctl .bt{font-size:12.5px;padding:4px 9px}
  .tp-grade{display:grid;grid-template-columns:repeat(18,1fr);grid-template-rows:repeat(7,1fr) .35fr repeat(2,1fr);gap:3px;flex:1;min-height:0}
  .tp-c{position:relative;border:1px solid var(--line2);border-radius:5px;background:var(--bg2);color:var(--ink);cursor:pointer;padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.05;min-width:0;min-height:0;overflow:hidden;font-family:var(--f-text);transition:opacity .2s,background .2s}
  .tp-c:hover,.tp-c:focus-visible{outline:2px solid var(--mod);outline-offset:0;z-index:1}
  .tp-c small{position:absolute;left:3px;top:2px;font-size:9px;color:var(--ink3)}.tp-c b{font-size:15px;font-weight:700}.tp-c i{font-style:normal;font-size:8.5px;color:var(--ink2);white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis}
  .tp-c .tp-m{position:absolute;right:2px;top:1px;font-size:9px}.tp-c.sel{outline:2px solid var(--warn);z-index:2}.tp-c.apag{opacity:.16}.tp-c.semd{background:repeating-linear-gradient(45deg,var(--bg2) 0 4px,var(--line) 4px 6px)}
  .tp-c.buraco{border-style:dashed;border-color:var(--warn);opacity:1;background:transparent}.tp-c.buraco b,.tp-c.buraco small{visibility:hidden}.tp-c.buraco i{color:var(--warn);font-size:8px}
  .tp-rod{margin:0;font:12px/1.4 var(--f-text);color:var(--ink3)}.tp-rod b{color:var(--ink2)}
  .tp-ref{border:1px dashed var(--line2);border-radius:5px;display:flex;align-items:center;justify-content:center;font:10px var(--f-text);color:var(--ink3)}
  .tp-dir{width:330px;flex:none;overflow:auto;border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--card);font:13.5px/1.5 var(--f-text)}
  .tp-dir h4{margin:0 0 2px;font:700 26px var(--f-text)}.tp-dir h4 span{font:600 14px var(--f-text);color:var(--ink2);margin-left:8px}.tp-dir table{width:100%;border-collapse:collapse;margin-top:8px}.tp-dir td{padding:3px 0;border-bottom:1px solid var(--line);vertical-align:top}.tp-dir td:first-child{color:var(--ink2);width:46%}
  .tp-dir td.maior{color:var(--ok);font-weight:700}.tp-dir .tp-nota{color:var(--ink3);font-size:12px;margin-top:8px}
  .tp-leg{display:flex;align-items:center;gap:8px;font-size:12px}.tp-leg span.g{width:160px;height:10px;border-radius:5px;display:inline-block}.tp-leg span.q{width:12px;height:12px;border-radius:3px;display:inline-block;vertical-align:-2px;margin-right:4px}
  .tp-pau{font:13px var(--f-text)}.tp-pau span{display:inline-block;min-width:34px;margin:1px 3px 1px 0;padding:1px 4px;border-radius:5px;border:1px solid var(--line2);text-align:center;color:var(--ink3)}.tp-pau span.ch{color:var(--ink);font-weight:700}.tp-pau span.at{outline:2px solid var(--warn)}
  @media print{.tp-barra,.tp-gaveta{display:none}}@media (prefers-reduced-motion:reduce){.tp-gaveta{transition:none}}`;

  /* ---------- estado da interface ---------- */
  let raiz = null, modo = "ficha", sel = 1, cmp = [1, 8], prop = "en", fam = "alc", temp = 298, zfill = 26, ano = 1869, busca = "", timer = null;
  const MODOS = [["ficha", "ficha"], ["prop", "mapa de calor"], ["fam", "famílias"], ["bloco", "blocos"], ["temp", "termômetro"], ["conf", "preenchimento"], ["cmp", "comparar"], ["hist", "descoberta"], ["rad", "radioativos"], ["est", "★ OBQ e ITA"]];
  const q = (s) => raiz.querySelector(s);
  const para = () => { if (timer) { clearInterval(timer); timer = null; } };

  const mini = () => { let s = ""; for (let z = 1; z <= 118; z++) { const [l, c] = T.pos(z); s += `<rect x="${(c - 1) * 4}" y="${(l - 1) * 2.6 - (l > 8 ? 1.4 : 0)}" width="3.2" height="2" fill="${CORB[T.bloco(z)]}"/>`; } return `<svg viewBox="0 0 72 25" width="64" height="22" aria-hidden="true">${s}</svg>`; };

  function monta() {
    if (raiz) return; const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    raiz = document.createElement("div"); raiz.className = "tp"; raiz.hidden = true;
    raiz.innerHTML = `<div class="tp-gaveta" role="dialog" aria-label="Tabela periódica"><div class="tp-topo"><b>Tabela periódica</b><input type="search" placeholder="nome, símbolo ou Z" aria-label="Buscar elemento por nome, símbolo ou número atômico"><div class="tp-modos">${MODOS.map(([k, n]) => `<button class="bt peq" data-modo="${k}" aria-pressed="${k === modo}">${n}</button>`).join("")}</div><button class="tp-x" aria-label="Fechar a tabela periódica" title="Fechar (Esc)">✕</button></div>
      <div class="tp-corpo"><div class="tp-esq"><div class="tp-ctl"></div><div class="tp-grade"></div><p class="tp-rod"><b>★</b> é um critério do Jarvis (elementos que mais aparecem em química geral de OBQ e ITA), <b>não</b> uma estatística de provas. · O <b>raio</b> mostrado é o de <b>van der Waals</b>. · <b>"sem dado"</b>: valor que não existe medido ou em que as fontes discordam; nada foi preenchido de memória.</p></div><aside class="tp-dir" aria-live="polite"></aside></div></div>
      <button class="tp-barra" aria-expanded="false" title="Abrir a tabela periódica">${mini()}<span>Tabela periódica</span><span class="tp-seta">▲</span></button>`;
    document.body.appendChild(raiz);
    let g = ""; for (let z = 1; z <= 118; z++) { const [l, c] = T.pos(z), e = EL(z); g += `<button class="tp-c" data-z="${z}" style="grid-row:${l > 8 ? l : l};grid-column:${c}" title="${nome(z)} (Z = ${z})"><small>${z}</small><b>${e ? e.s : "?"}</b><i>${nome(z)}</i><span class="tp-m"></span></button>`; }
    g += `<div class="tp-ref" style="grid-row:6;grid-column:3">57–71</div><div class="tp-ref" style="grid-row:7;grid-column:3">89–103</div>`;
    q(".tp-grade").innerHTML = g.replace(/grid-row:(9|10);/g, (m, l) => `grid-row:${l};`);
    q(".tp-barra").addEventListener("click", () => T.abre(!raiz.classList.contains("tp-aberta")));
    q(".tp-x").addEventListener("click", () => T.abre(false));
    q(".tp-grade").addEventListener("click", (ev) => { const b = ev.target.closest(".tp-c"); if (!b) return; const z = +b.dataset.z; if (modo === "cmp") { cmp = [cmp[1], z]; } if (modo === "conf") zfill = z; sel = z; pinta(); });
    q(".tp-modos").addEventListener("click", (ev) => { const b = ev.target.closest("[data-modo]"); if (!b) return; para(); modo = b.dataset.modo; controles(); pinta(); });
    q(".tp-topo input").addEventListener("input", (ev) => { busca = ev.target.value.trim().toLowerCase(); const a = acha(); if (a.length) sel = a[0]; pinta(); });
    document.addEventListener("keydown", (ev) => { if (ev.key === "Escape" && raiz && raiz.classList.contains("tp-aberta")) { ev.stopPropagation(); T.abre(false); } }, true);
    controles(); pinta();
  }
  const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const acha = () => { if (!busca) return []; const b = semAcento(busca), r = []; for (let z = 1; z <= 118; z++) { const e = EL(z); if (String(z) === b || (e && e.s.toLowerCase() === b)) r.unshift(z); else if (semAcento(nome(z)).includes(b) && b.length > 1) r.push(z); } return r; };
  T.busca = (texto) => { busca = String(texto).trim().toLowerCase(); return acha(); };

  function controles() {
    raiz.querySelectorAll("[data-modo]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.modo === modo)); const c = q(".tp-ctl"); let h = "";
    if (modo === "ficha") h = "Clique num elemento para ver a ficha.";
    if (modo === "prop") h = `<select aria-label="Propriedade">${PROP.map((p) => `<option value="${p[0]}"${p[0] === prop ? " selected" : ""}>${p[1]}${p[2] ? " (" + p[2] + ")" : ""}</option>`).join("")}</select><span class="tp-leg"></span>`;
    if (modo === "fam") h = FAM.map((f) => `<button class="bt peq" data-fam="${f[0]}" aria-pressed="${f[0] === fam}">${f[1]}</button>`).join("");
    if (modo === "bloco") h = `<span class="tp-leg">${["s", "p", "d", "f"].map((b) => `<span><span class="q" style="background:${CORB[b]}"></span>bloco ${b}</span>`).join("")}<span>· a fronteira entre f e d (La/Lu, Ac/Lr) depende da convenção</span></span>`;
    if (modo === "temp") h = `<input type="range" min="0" max="6000" step="1" value="${temp}" aria-label="Temperatura em kelvin"><b class="tp-v"></b><span class="tp-leg"><span><span class="q" style="background:#5b9cf5"></span>sólido</span><span><span class="q" style="background:#4cc38a"></span>líquido</span><span><span class="q" style="background:#ef6b6b"></span>gás</span><span><span class="q semd" style="background:var(--line)"></span>sem dado</span></span>`;
    if (modo === "conf") h = `<input type="range" min="1" max="118" step="1" value="${zfill}" aria-label="Número atômico"><b class="tp-v"></b><button class="bt peq" data-b="toca">▶ preencher desde o H</button>`;
    if (modo === "cmp") h = "Clique em dois elementos: o último clicado entra, o mais antigo sai.";
    if (modo === "hist") h = `<input type="range" min="1660" max="2015" step="1" value="${ano}" aria-label="Ano"><b class="tp-v"></b><button class="bt peq" data-b="toca">▶ passar os anos</button><span class="tp-leg"><span><span class="q" style="border:1px dashed var(--warn)"></span>lacuna prevista por Mendeleiev</span><span>· hachurado: sem ano nos dados</span></span>`;
    if (modo === "rad") h = "☢ = elemento sem nenhum isótopo estável. Clique para ver o isótopo mais estável e a meia-vida.";
    if (modo === "est") h = "★ = elementos que mais aparecem em questões da OBQ e do ITA, pelo critério do Jarvis (lista editável no arquivo de dados; não é estatística de provas).";
    c.innerHTML = h;
    const sl = c.querySelector("input[type=range]"); if (sl) sl.addEventListener("input", () => { para(); if (modo === "temp") temp = +sl.value; if (modo === "conf") { zfill = +sl.value; sel = zfill; } if (modo === "hist") ano = +sl.value; pinta(); });
    const se = c.querySelector("select"); if (se) se.addEventListener("change", () => { prop = se.value; pinta(); });
    c.querySelectorAll("[data-fam]").forEach((b) => b.addEventListener("click", () => { fam = b.dataset.fam; controles(); pinta(); }));
    const tc = c.querySelector("[data-b=toca]"); if (tc) tc.addEventListener("click", () => { para(); if (modo === "conf") { zfill = 1; timer = setInterval(() => { zfill++; sel = zfill; if (zfill >= 118) para(); const s2 = q(".tp-ctl input[type=range]"); if (s2) s2.value = zfill; pinta(); }, 220); } else { ano = 1660; timer = setInterval(() => { ano += 3; if (ano >= 2015) { ano = 2015; para(); } const s2 = q(".tp-ctl input[type=range]"); if (s2) s2.value = ano; pinta(); }, 90); } pinta(); });
  }
  const mistura = (t) => { const a = [43, 76, 140], b = [239, 107, 107], m = [232, 176, 75], u = t < 0.5 ? t * 2 : (t - 0.5) * 2, p = t < 0.5 ? a : m, f = t < 0.5 ? m : b; return `rgb(${p.map((v, i) => Math.round(v + (f[i] - v) * u)).join(",")})`; };

  function pinta() {
    const achados = acha(), cels = raiz.querySelectorAll(".tp-c"), est = new Set(D().estrelas || []), men = D().mendeleiev || [], anoPrev = D().anoMendeleiev || null; let min = Infinity, max = -Infinity;
    if (modo === "prop") for (let z = 1; z <= 118; z++) { const v = EL(z) && EL(z)[prop]; if (v !== null && v !== undefined) { min = Math.min(min, v); max = Math.max(max, v); } }
    cels.forEach((b) => { const z = +b.dataset.z, e = EL(z) || {}; let bg = "", apag = false, semd = false, marca = "", buraco = false, rot = nome(z);
      if (modo === "prop") { const v = e[prop]; if (v === null || v === undefined) semd = true; else bg = mistura((v - min) / (max - min || 1)); }
      if (modo === "fam") { const f = FAM.find((x) => x[0] === fam); if (f[2](z)) bg = "color-mix(in srgb,var(--mod) 55%,var(--bg2))"; else apag = true; }
      if (modo === "bloco") bg = `color-mix(in srgb,${CORB[T.bloco(z)]} 45%,var(--bg2))`;
      if (modo === "temp") { const s = T.estado(z, temp); if (!s) semd = true; else bg = `color-mix(in srgb,${s === "sólido" ? "#5b9cf5" : s === "líquido" ? "#4cc38a" : "#ef6b6b"} 50%,var(--bg2))`; }
      if (modo === "conf") { if (z <= zfill) bg = `color-mix(in srgb,${CORB[T.bloco(z)]} 45%,var(--bg2))`; else apag = true; }
      if (modo === "cmp") { if (cmp.includes(z)) bg = "color-mix(in srgb,var(--warn) 45%,var(--bg2))"; }
      if (modo === "hist") { const m = men.find((x) => x.z === z); if (e.ano === null && !e.autor) semd = true; else if (e.ano !== null && e.ano > ano) { if (m && anoPrev && ano >= anoPrev) { buraco = true; rot = m.eka; } else apag = true; } else if (m) bg = "color-mix(in srgb,var(--warn) 40%,var(--bg2))"; else bg = "color-mix(in srgb,var(--mod) 30%,var(--bg2))"; }
      if (modo === "rad") { if (e.meia) { marca = "☢"; bg = "color-mix(in srgb,var(--warn) 40%,var(--bg2))"; } else apag = true; }
      if (modo === "est") { if (est.has(z)) { marca = "★"; bg = "color-mix(in srgb,var(--warn) 40%,var(--bg2))"; } else apag = true; }
      if (modo === "ficha") { if (est.has(z)) marca = "★"; else if (e.meia) marca = "☢"; }
      if (achados.length) apag = !achados.includes(z);
      b.style.background = semd || buraco ? "" : bg; b.classList.toggle("apag", apag && !buraco); b.classList.toggle("semd", semd); b.classList.toggle("buraco", buraco); b.classList.toggle("sel", z === sel && modo !== "cmp"); b.querySelector(".tp-m").textContent = marca; b.querySelector("i").textContent = rot; });
    const c = q(".tp-ctl");
    if (modo === "prop") { const p = PROP.find((x) => x[0] === prop), lg = c.querySelector(".tp-leg"); if (lg) lg.innerHTML = `${nf(min, p[3])} <span class="g" style="background:linear-gradient(90deg,${mistura(0)},${mistura(0.5)},${mistura(1)})"></span> ${nf(max, p[3])} ${p[2]} · <span class="q semd" style="background:repeating-linear-gradient(45deg,var(--bg2) 0 3px,var(--line2) 3px 5px)"></span>sem dado`; }
    const v = c.querySelector(".tp-v"); if (v) v.textContent = modo === "temp" ? temp + " K (" + nf(temp - 273.15, 0) + " °C)" : modo === "conf" ? "Z = " + zfill + " · " + nome(zfill) : "ano " + ano;
    q(".tp-dir").innerHTML = modo === "cmp" ? compara() : modo === "conf" ? preench() : modo === "hist" ? historia() : ficha(sel);
  }
  const linha = (r, v) => `<tr><td>${r}</td><td>${v}</td></tr>`;
  function ficha(z) { const e = EL(z); if (!e) return "<p>Sem dados para este elemento.</p>"; const g = T.grupo(z), kc = (k) => (k === null || k === undefined ? "sem dado" : nf(k, 1) + " K (" + nf(k - 273.15, 0) + " °C)");
    return `<h4>${e.s}<span>${nome(z)}${(D().estrelas || []).includes(z) ? " ★" : ""}</span></h4><table>` + linha("número atômico (Z)", z) + linha("massa atômica", e.massa === null ? "sem dado" : nf(e.massa, 4) + " u") + linha("posição", (g ? "grupo " + g : z <= 71 ? "lantanídeo" : "actinídeo") + " · " + T.periodo(z) + "º período · bloco " + T.bloco(z)) + linha("configuração eletrônica", confBonita(e.conf)) + linha("estados de oxidação", e.ox || "sem dado") + linha("eletronegatividade (Pauling)", nf(e.en, 2)) + linha("raio atômico (van der Waals)", e.raio === null ? "sem dado" : nf(e.raio, 0) + " pm") + linha("1ª energia de ionização", e.ei === null ? "sem dado" : nf(e.ei, 3) + " eV") + linha("afinidade eletrônica", e.ae === null ? "sem dado" : nf(e.ae, 3) + " eV") + linha("estado a 25 °C", e.estado || "sem dado") + linha("ponto de fusão", kc(e.pf)) + linha("ponto de ebulição", kc(e.pe)) + linha("densidade", e.dens === null ? "sem dado" : nf(e.dens, 5) + " g/cm³") + linha("descoberta", e.ano === null && !e.autor ? "sem dado" : (e.ano === null ? "" : e.ano + " · ") + (e.autor || "autor: sem dado")) + (e.meia ? linha("☢ isótopo mais estável", e.meia) : "") + linha("usos", e.usos || "sem dado") + `</table><p class="tp-nota">"sem dado" = valor que não existe medido ou em que as fontes discordam (nada foi preenchido de memória). O raio é o de van der Waals. Para corrigir: assets/tabela-dados.js.</p>`; }
  function compara() { const [a, b] = cmp.map(EL); if (!a || !b) return ""; const num = (r, k, d, un) => { const x = a[k], y = b[k], ok = x !== null && y !== null && x !== undefined && y !== undefined; return `<tr><td>${r}</td><td class="${ok && x > y ? "maior" : ""}">${nf(x, d)}</td><td class="${ok && y > x ? "maior" : ""}">${nf(y, d)}${un ? " " + un : ""}</td></tr>`; };
    return `<h4 style="font-size:20px">${a.s} × ${b.s}<span>${nome(a.z)} e ${nome(b.z)}</span></h4><table><tr><td></td><td><b>${a.s}</b></td><td><b>${b.s}</b></td></tr>` + num("Z", "z", 0) + num("massa atômica", "massa", 3, "u") + num("eletronegatividade", "en", 2) + num("raio (van der Waals)", "raio", 0, "pm") + num("energia de ionização", "ei", 3, "eV") + num("afinidade eletrônica", "ae", 3, "eV") + num("ponto de fusão", "pf", 1, "K") + num("ponto de ebulição", "pe", 1, "K") + num("densidade", "dens", 4, "g/cm³") + `<tr><td>bloco</td><td>${T.bloco(a.z)}</td><td>${T.bloco(b.z)}</td></tr><tr><td>grupo</td><td>${T.grupo(a.z) || "—"}</td><td>${T.grupo(b.z) || "—"}</td></tr><tr><td>período</td><td>${T.periodo(a.z)}</td><td>${T.periodo(b.z)}</td></tr><tr><td>configuração</td><td>${confBonita(a.conf)}</td><td>${confBonita(b.conf)}</td></tr></table><p class="tp-nota">Em verde: o maior valor de cada linha.</p>`; }
  function preench() { const z = zfill, m = T.madelung(z), cheio = {}; m.forEach(([a, k]) => (cheio[a] = k)); const ult = m[m.length - 1][0], e = EL(z), exc = T.excecao(z), niveis = [["1s"], ["2s", "2p"], ["3s", "3p", "3d"], ["4s", "4p", "4d", "4f"], ["5s", "5p", "5d", "5f"], ["6s", "6p", "6d"], ["7s", "7p"]];
    return `<h4>${e ? e.s : ""}<span>${nome(z)} · Z = ${z}</span></h4><p style="margin:6px 0 2px;color:var(--ink2)">Diagrama de Pauling (ordem: ${ORDEM.join(" → ")})</p><div class="tp-pau">${niveis.map((l) => l.map((a) => `<span class="${cheio[a] ? "ch" : ""}${a === ult ? " at" : ""}" style="${cheio[a] ? "background:color-mix(in srgb," + CORB[a[1]] + " " + Math.round((cheio[a] / CAP[a[1]]) * 55) + "%,transparent)" : ""}">${a}${cheio[a] ? sobre(cheio[a]) : ""}</span>`).join("")).join("<br>")}</div>
      <table>${linha("pela regra (Madelung)", confTxt(m))}${linha("medida (dados)", confBonita(e && e.conf))}</table>${exc === true ? `<p class="tp-nota" style="color:var(--warn)">Exceção: a configuração medida deste elemento é diferente da prevista pela regra.</p>` : exc === null ? `<p class="tp-nota">Sem configuração medida nos dados para comparar.</p>` : ""}<p class="tp-nota">Subnível destacado: o último a receber elétrons. A regra de Madelung acerta a maioria dos elementos, não todos.</p>`; }
  function historia() { const els = D().elementos, antigos = els.filter((e) => e.ano === null && e.autor).length, semAno = els.filter((e) => e.ano === null && !e.autor).length, ate = els.filter((e) => e.ano !== null && e.ano <= ano), novos = ate.filter((e) => e.ano > ano - 25).sort((a, b) => b.ano - a.ano).slice(0, 8), men = D().mendeleiev || [];
    return `<h4 style="font-size:20px">${ano}<span>${antigos + ate.length} elementos conhecidos</span></h4><table>${linha("conhecidos desde a Antiguidade", antigos)}${linha("descobertos até " + ano, ate.length)}${semAno ? linha("sem ano nos dados (fontes discordam)", semAno) : ""}</table><p style="margin:10px 0 2px;color:var(--ink2)">Descobertos nos 25 anos anteriores:</p><table>${novos.map((e) => linha(e.ano + " · " + e.s + " (" + nome(e.z) + ")", e.autor || "sem dado")).join("") || linha("—", "")}</table>${men.length ? `<p class="tp-nota">Lacunas que Mendeleiev deixou na tabela${D().anoMendeleiev ? " (previsões de " + D().anoMendeleiev + ")" : ""}: ${men.map((m) => m.eka + " = " + nome(m.z) + " (" + (EL(m.z) ? EL(m.z).ano : "?") + ")").join("; ")}.</p>` : ""}`; }

  /* ---------- ligar, desligar, abrir ---------- */
  T.abre = (on) => { if (!raiz) return; raiz.classList.toggle("tp-aberta", on); q(".tp-barra").setAttribute("aria-expanded", on); q(".tp-barra").title = on ? "Baixar a tabela periódica" : "Abrir a tabela periódica"; if (!on) para(); };
  T.liga = (on) => { if (on && !pode()) on = false; if (on) monta(); if (raiz) { raiz.hidden = !on; if (!on) T.abre(false); } document.body.classList.toggle("tp-on", !!on); sincroniza(); };
  T.ligaSalvo = (on) => { grava(K_ON, !!on); if (on) { grava(K_USO, true); if (window.CALC && CALC.ligaSalvo) CALC.ligaSalvo(false); if (window.CALC2 && CALC2.ligaSalvo) CALC2.ligaSalvo(false); } T.liga(on); };
  T.ligada = () => !!le(K_ON);
  T._ = { EL, FAM, PROP, acha: () => acha(), modo: (m) => { modo = m; controles(); pinta(); }, estado: () => ({ modo, sel, cmp, prop, fam, temp, zfill, ano }), define: (o) => { if (o.sel) sel = o.sel; if (o.cmp) cmp = o.cmp; if (o.prop) prop = o.prop; if (o.fam) fam = o.fam; if (o.temp !== undefined) temp = o.temp; if (o.zfill) zfill = o.zfill; if (o.ano) ano = o.ano; controles(); pinta(); } };

  /* interruptores: ao lado do título (páginas iniciais da Química) e, depois da primeira vez, na engrenagem */
  const novoSw = (id, rot) => { const b = document.createElement("button"); b.className = "interruptor" + (id ? "" : " tp-sw"); if (id) b.id = id; b.type = "button"; b.setAttribute("role", "switch"); b.setAttribute("aria-label", rot); b.title = rot; b.innerHTML = "<span></span>"; b.addEventListener("click", () => T.ligaSalvo(!T.ligada())); return b; };
  function sincroniza() {
    const on = T.ligada() && pode();
    document.querySelectorAll(".tp-sw, #cfg-tabela").forEach((b) => { b.setAttribute("aria-checked", on); if (b.classList.contains("tp-sw")) b.title = on ? "desativar tabela periódica" : "ativar tabela periódica"; });
    const c2 = document.getElementById("cfg-calc2"), jaTem = document.getElementById("cfg-tabela");
    if (c2 && !jaTem && le(K_USO) && pode()) { const l = document.createElement("div"); l.className = "cfg-linha"; l.innerHTML = `<span class="cfg-dupla">Tabela periódica<small>ferramenta de rodapé</small></span>`; l.appendChild(novoSw("cfg-tabela", "Mostrar a tabela periódica no rodapé")); c2.closest(".cfg-linha").after(l); l.querySelector("button").setAttribute("aria-checked", on); }
  }
  function titulo() { const h = document.querySelector(".hero2 h1"); if (!h || h.querySelector(".tp-sw") || !window.F || !F.materia || F.materia() !== "quimica" || !pode()) return; h.appendChild(novoSw("", "ativar tabela periódica")); sincroniza(); }
  document.addEventListener("DOMContentLoaded", () => {
    ["cfg-calc", "cfg-calc2"].forEach((id) => { const sw = document.getElementById(id); if (sw) sw.addEventListener("click", () => { if (sw.getAttribute("aria-checked") === "true" && T.ligada()) T.ligaSalvo(false); }); }); /* só uma ferramenta de rodapé por vez */
    const alvo = document.getElementById("pagina") || document.body; new MutationObserver(() => titulo()).observe(alvo, { childList: true, subtree: true });
    window.addEventListener("hashchange", () => setTimeout(() => { titulo(); if (T.ligada() && !pode()) T.liga(false); }, 0));
    titulo(); sincroniza(); if (T.ligada()) T.liga(true);
  });
})();
