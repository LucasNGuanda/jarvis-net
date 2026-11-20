/* Gráficos de funções (β 11.6): a TELA da aba-ferramenta da Matemática (#/matematica-graficos).
   É uma página, não um tema: o motor a chama pelo campo opcional "pagina" da área (window.PAGINAS.graficos).
   As contas todas (leitor de expressões, descontinuidades, raízes, extremos, derivada, integral) ficam em assets/graficos-nucleo.js (window.GRAF).
   Sem biblioteca, sem IA e sem API; nenhum texto digitado vira código (não há eval nem new Function).
   Salvo em mat:graficos (funções, parâmetros e vista); entra no exportar/importar como tudo o que tem prefixo mat:. */
(function () {
  "use strict";
  const CHAVE = "mat:graficos", K_AV = "fisica:aviso-cel";
  const CORES = ["--mA", "--mT", "--mX", "--mS", "--mK2", "--mK3", "--mK5", "--mO"];
  const MODELOS = [
    ["afim", "Afim", "y = a·x + b", { a: [1, -10, 10, 0.1], b: [0, -10, 10, 0.1] }],
    ["quad", "Quadrática", "y = a·x² + b·x + c", { a: [1, -5, 5, 0.1], b: [0, -10, 10, 0.1], c: [0, -10, 10, 0.1] }],
    ["exp", "Exponencial", "y = k^x", { k: [2, 0.1, 5, 0.1] }],
    ["log", "Logarítmica", "y = log_k(x)", { k: [2, 0.1, 5, 0.1] }],
    ["sen", "Seno", "y = A·sen(w·x + f)", { A: [1, -5, 5, 0.1], w: [1, -5, 5, 0.1], f: [0, -6.3, 6.3, 0.1] }],
    ["cos", "Cosseno", "y = cos(x)", {}],
    ["tg", "Tangente", "y = tg(x)", {}],
    ["pa", "PA", "a_n = p + (n − 1)·r", { p: [1, -10, 10, 0.5], r: [2, -5, 5, 0.5] }],
    ["pg", "PG", "a_n = p·q^(n − 1)", { p: [1, -10, 10, 0.5], q: [2, -3, 3, 0.1] }],
  ];
  const TECLAS = [["x²", "²"], ["^", "^"], ["√", "raiz("], ["π", "π"], ["|x|", "|"], ["·", "·"], ["÷", "/"], ["(", "("], [")", ")"], ["sen", "sen("], ["cos", "cos("], ["tg", "tg("], ["log", "log("], ["ln", "ln("], ["e", "e"]];
  const CSS = `
  body.pg-ferramenta .menu{display:none}body.pg-ferramenta .pagina{max-width:none}body.pg-ferramenta .principal{margin-left:0;padding-left:32px;padding-right:32px;padding-bottom:40px}
  .gf-cab{display:flex;align-items:baseline;gap:16px;flex-wrap:wrap;margin:0 0 14px}.gf-cab h1{font-size:30px;margin:0;line-height:1.15}.gf-cab p{margin:0;color:var(--ink2);font-size:14.5px}
  .gfx{display:grid;grid-template-columns:372px minmax(0,1fr);gap:16px;align-items:start}
  .gf-esq{display:flex;flex-direction:column;gap:12px;min-width:0}
  .gf-cx{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px}
  .gf-cx h2{font:600 11px var(--f-text);text-transform:uppercase;letter-spacing:.08em;color:var(--ink3);margin:0 0 8px}
  .gf-lista{display:flex;flex-direction:column;gap:10px}
  .gf-f{border:1px solid var(--line);border-radius:10px;padding:8px;background:var(--bg2);border-left:4px solid var(--c)}
  .gf-f.oculta{opacity:.62}
  .gf-l1{display:flex;gap:6px;align-items:center}
  .gf-l1 input{flex:1;min-width:0;height:36px;padding:0 10px;border-radius:8px;border:1px solid var(--line2);background:var(--bg);color:var(--ink);font:500 15px var(--f-text)}
  .gf-l1 input:focus{outline:2px solid var(--c);outline-offset:1px}.gf-f.erro .gf-l1 input{border-color:var(--bad)}
  .gf-ib{flex:none;width:32px;height:32px;border-radius:8px;border:1px solid var(--line2);background:var(--card2);color:var(--ink);cursor:pointer;font:600 13px var(--f-text);display:grid;place-items:center;padding:0}
  .gf-ib:hover{border-color:var(--c, var(--line2))}.gf-ib[aria-pressed=true]{background:color-mix(in srgb,var(--c) 26%,var(--card2));border-color:var(--c)}
  .gf-olho{border-radius:50%}.gf-olho i{display:block;width:14px;height:14px;border-radius:50%;background:var(--c);border:2px solid var(--c)}.gf-olho[aria-pressed=false] i{background:transparent}
  .gf-tex{min-height:26px;padding:6px 4px 0;font-size:15px;overflow-x:auto;overflow-y:hidden;color:var(--ink)}
  .gf-erro{margin-top:6px;font-size:13px;line-height:1.4;color:var(--ink)}.gf-erro code{display:block;font:13px ui-monospace,Menlo,Consolas,monospace;background:var(--bg);border-radius:6px;padding:4px 7px;white-space:pre-wrap;word-break:break-all;margin-bottom:4px}
  .gf-erro mark{background:color-mix(in srgb,var(--bad) 45%,transparent);color:var(--ink);border-bottom:2px solid var(--bad);padding:0 1px;border-radius:2px}
  .gf-extra{margin-top:6px;font-size:13px;color:var(--ink2);display:flex;flex-wrap:wrap;gap:6px;align-items:center}
  .gf-extra input{width:74px;height:30px;padding:0 6px;border-radius:7px;border:1px solid var(--line2);background:var(--bg);color:var(--ink);font:500 14px var(--f-text)}
  .gf-extra b{color:var(--ink);font-variant-numeric:tabular-nums}.gf-extra .gf-val{flex:0 0 100%}
  .gf-acoes{display:flex;gap:8px;flex-wrap:wrap}.gf-acoes .bt{font-size:13px;padding:5px 11px}
  .gf-mods,.gf-tecl{display:flex;flex-wrap:wrap;gap:6px}.gf-mods .bt{font-size:13px;padding:4px 10px}.gf-tecl .bt{font-size:14px;padding:3px 0;min-width:38px;text-align:center}
  .gf-p{display:grid;grid-template-columns:22px minmax(0,1fr) 62px;gap:8px;align-items:center;padding:4px 0}
  .gf-p .gf-nome{font:italic 600 17px var(--f-text);text-align:center}.gf-p output{font:600 14px var(--f-text);font-variant-numeric:tabular-nums;text-align:right}
  .gf-p input[type=range]{width:100%}
  .gf-pl{grid-column:2/4;display:flex;gap:6px;align-items:center;font-size:11.5px;color:var(--ink3)}
  .gf-pl input{width:58px;height:24px;padding:0 5px;border-radius:6px;border:1px solid var(--line);background:var(--bg);color:var(--ink2);font:12px var(--f-text)}
  .gf-vazio{color:var(--ink3);font-size:13px;margin:0}
  .gf-dir{position:relative;min-width:0}
  .gf-palco{position:relative;height:min(calc(100vh - 190px),680px);min-height:420px;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--bg)}
  .gf-palco canvas{position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab;touch-action:none}.gf-palco canvas.arr{cursor:grabbing}
  .gf-bts{position:absolute;right:10px;top:10px;display:flex;flex-direction:column;gap:6px}
  .gf-bts button{width:36px;height:36px;border-radius:9px;border:1px solid var(--line2);background:color-mix(in srgb,var(--card) 92%,transparent);color:var(--ink);font:600 16px var(--f-text);cursor:pointer;padding:0}
  .gf-bts button:hover{border-color:var(--materia,var(--line2))}.gf-bts button[aria-pressed=true]{background:color-mix(in srgb,var(--materia,#888) 30%,var(--card))}
  .gf-bts .gf-sep{height:4px}
  .gf-dica{position:absolute;pointer-events:none;z-index:2;max-width:260px;padding:6px 9px;border-radius:8px;background:var(--card);border:1px solid var(--line2);box-shadow:0 6px 18px rgba(0,0,0,.35);font:500 13px/1.35 var(--f-text);color:var(--ink);white-space:nowrap}
  .gf-dica b{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--c,var(--ink3))}
  .gf-pe{margin:8px 2px 0;font-size:12.5px;color:var(--ink3);line-height:1.45}
  .gf-conf{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:13.5px}.gf-conf .bt.sim{border-color:var(--bad);color:var(--bad)}
  .gf-av{display:none}.gf-conf[hidden],.gf-extra[hidden],.gf-erro[hidden],.gf-dica[hidden],.gf-av[hidden]{display:none!important}
  @media (max-width:700px){
    body.pg-ferramenta .principal{padding-left:12px;padding-right:12px}
    .gf-cab h1{font-size:24px}.gf-cab p{display:none}
    .gfx{grid-template-columns:minmax(0,1fr)}.gf-dir{order:-1}
    .gf-palco{height:56vh;min-height:300px}
    .gf-l1 input{height:44px;font-size:16px}.gf-ib{width:44px;height:44px;font-size:15px}
    .gf-bts button{width:44px;height:44px}
    .gf-mods .bt,.gf-acoes .bt,.gf-conf .bt{min-height:44px;padding:0 13px;font-size:14px}.gf-tecl .bt{min-height:44px;min-width:44px;font-size:15px}
    .gf-extra input{height:44px;width:84px;font-size:16px}.gf-pl input{height:36px;width:64px;font-size:16px}
    .gf-p{grid-template-columns:24px minmax(0,1fr) 58px}.gf-p input[type=range]{height:44px}
    .gf-av{display:flex;align-items:flex-start;gap:10px;margin:0 0 10px;padding:10px 6px 10px 12px;border:1px solid color-mix(in srgb,var(--warn) 55%,transparent);background:color-mix(in srgb,var(--warn) 10%,var(--card));border-radius:10px;font:13.5px/1.4 var(--f-text);color:var(--ink)}
    .gf-av span{flex:1;padding-top:2px}.gf-av button{flex:none;width:44px;height:44px;margin:-6px 0;border:0;border-radius:50%;background:none;color:var(--ink2);font-size:18px;cursor:pointer}
  }`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cel = () => !!(window.matchMedia && matchMedia("(max-width:700px)").matches);
  const le = () => { try { const v = JSON.parse(localStorage.getItem(CHAVE) || "null"); return v && typeof v === "object" && Array.isArray(v.fs) ? v : null; } catch (e) { return null; } };
  const numDe = (txt, P) => { /* campo de número: aceita 2,5 · pi · π/2 · 2a */ try { const l = window.GRAF.le(String(txt)); if (l.tipo !== "funcao") return NaN; const f = window.GRAF.funcao(l), v = f(0, P || {}); return v === f(1, P || {}) && v === f(-2.5, P || {}) ? v : NaN; /* não pode depender de x */ } catch (e) { return NaN; } };

  function pagina(el, F) {
    const G = window.GRAF;
    if (!document.getElementById("gf-css")) { const st = document.createElement("style"); st.id = "gf-css"; st.textContent = CSS; document.head.appendChild(st); }
    document.body.classList.add("pg-ferramenta");
    let uid = 0, vivo = true, sujo = true, salvaT = null, ptsT = null, foco = null, confirma = false, ptsVer = 0;
    const salvo = le();
    const E = { fs: [], ps: {}, vista: null, pi: false };
    const nova = (txt, o) => ({ id: ++uid, txt: txt || "", cor: (o && o.cor) || CORES[E.fs.reduce((m, f) => Math.max(m, CORES.indexOf(f.cor) + 1), 0) % CORES.length], vis: !o || o.vis !== false, der: !!(o && o.der), area: (o && o.area) || { on: false, a: "0", b: "1" }, lida: null, f: null, erro: null });
    if (salvo) { salvo.fs.filter((f) => f && typeof f === "object" && typeof f.txt === "string").slice(0, 24).forEach((f) => E.fs.push(nova(f.txt.slice(0, 300), { cor: CORES.includes(f.cor) ? f.cor : null, vis: f.vis !== false, der: f.der === true, area: f.area && typeof f.area === "object" ? { on: f.area.on === true, a: String(f.area.a == null ? "0" : f.area.a).slice(0, 40), b: String(f.area.b == null ? "1" : f.area.b).slice(0, 40) } : null }))); /* dado salvo é conferido campo a campo: nada estragado derruba a página */ if (salvo.ps && typeof salvo.ps === "object") for (const k of Object.keys(salvo.ps).slice(0, 40)) { const p = salvo.ps[k]; if (p && [p.v, p.min, p.max, p.passo].every((v) => typeof v === "number" && Number.isFinite(v))) E.ps[k] = { v: p.v, min: p.min, max: p.max, passo: p.passo }; } if (salvo.vista && ["cx", "cy", "ex", "ey"].every((k) => typeof salvo.vista[k] === "number" && Number.isFinite(salvo.vista[k])) && salvo.vista.ex > 0 && salvo.vista.ey > 0) E.vista = salvo.vista; E.pi = !!salvo.pi; }
    if (!E.fs.length) E.fs.push(nova(salvo ? "" : "y = x² − 3x + 2"));

    el.innerHTML = `<div class="gf-cab"><h1>Gráficos de funções</h1><p>Digite uma função e a curva aparece na hora. Arraste o plano, use a roda do mouse para aproximar e passe o mouse nos pontos marcados.</p></div>
      <div class="gf-av" role="note" hidden><span>Obs.: no celular esta ferramenta não funciona muito bem. Para a melhor experiência, use um computador.</span><button type="button" aria-label="Fechar o aviso">✕</button></div>
      <div class="gfx"><div class="gf-esq">
        <div class="gf-cx"><h2>Funções</h2><div class="gf-lista"></div>
          <div class="gf-acoes" style="margin-top:10px"><button type="button" class="bt pri" data-a="mais">+ função</button><button type="button" class="bt" data-a="limpa">Limpar tudo</button></div><div class="gf-conf" hidden style="margin-top:10px"><span>Apagar todas as funções e os parâmetros? Isso não apaga seu progresso.</span><button type="button" class="bt sim" data-a="sim">Apagar</button><button type="button" class="bt" data-a="nao">Cancelar</button></div></div>
        <div class="gf-cx"><h2>Teclas</h2><div class="gf-tecl">${TECLAS.map(([r, v]) => `<button type="button" class="bt" data-t="${esc(v)}" title="escrever ${esc(v)}">${esc(r)}</button>`).join("")}</div></div>
        <div class="gf-cx gf-cxp"><h2>Parâmetros</h2><div class="gf-ps"></div></div>
        <div class="gf-cx"><h2>Modelos prontos</h2><div class="gf-mods">${MODELOS.map((m) => `<button type="button" class="bt" data-m="${m[0]}" title="${esc(m[2])}">${m[1]}</button>`).join("")}</div></div>
      </div>
      <div class="gf-dir"><div class="gf-palco"><canvas aria-label="plano cartesiano com as funções digitadas" tabindex="0"></canvas><div class="gf-dica" hidden></div>
        <div class="gf-bts"><button type="button" data-v="+" title="Aproximar" aria-label="Aproximar">+</button><button type="button" data-v="-" title="Afastar" aria-label="Afastar">−</button><button type="button" data-v="0" title="Voltar à vista inicial" aria-label="Voltar à vista inicial">⌂</button><span class="gf-sep"></span><button type="button" data-v="y+" title="Esticar o eixo y" aria-label="Esticar o eixo y">↕</button><button type="button" data-v="y-" title="Encolher o eixo y" aria-label="Encolher o eixo y">⇵</button><button type="button" data-v="pi" title="Eixo x em múltiplos de π" aria-label="Eixo x em múltiplos de π" aria-pressed="false">π</button></div></div>
        <p class="gf-pe">Pontos marcados: <b>raízes</b>, <b>máximos</b>, <b>mínimos</b> e <b>interseções</b> que estão na tela, achados numericamente. A derivada e a integral também são numéricas. Onde a função não existe (log de número negativo, raiz de negativo, divisão por zero), nada é desenhado.</p></div></div>`;
    const q = (s) => el.querySelector(s), cv = q("canvas"), ctx = cv.getContext("2d"), dica = q(".gf-dica"), lista = q(".gf-lista");
    const P = () => { const o = {}; for (const k in E.ps) o[k] = E.ps[k].v; return o; };
    const cor = (f) => `var(${f.cor})`;

    /* ---------- aviso de celular (o mesmo das outras ferramentas: uma vez, com botão de fechar) ---------- */
    const mostraAviso = () => { const a = q(".gf-av"); let v = {}; try { v = JSON.parse(localStorage.getItem(K_AV) || "{}") || {}; } catch (e) {} if (v.graficos || !cel()) return; a.hidden = false; a.querySelector("button").onclick = () => { let w = {}; try { w = JSON.parse(localStorage.getItem(K_AV) || "{}") || {}; } catch (e) {} w.graficos = true; try { localStorage.setItem(K_AV, JSON.stringify(w)); } catch (e) {} a.hidden = true; }; };

    /* ---------- ler as funções ---------- */
    function interpreta(f) { f.lida = null; f.f = null; f.erro = null; if (!f.txt.trim()) return; try { f.lida = G.le(f.txt); f.f = G.funcao(f.lida); } catch (e) { f.erro = e.graf ? { msg: e.message, pos: e.pos, tam: e.tam } : { msg: "Não consegui ler esta expressão.", pos: 0, tam: 1 }; } }
    function usados() { const l = []; E.fs.forEach((f) => { if (f.lida) f.lida.params.forEach((p) => { if (!l.includes(p)) l.push(p); }); }); return l; }
    const psUsados = () => { const o = {}; usados().forEach((k) => { if (E.ps[k]) o[k] = E.ps[k]; }); return o; }; /* letras que apareceram só no meio da digitação não são gravadas */
    function garanteParams(padrao) { usados().forEach((p) => { if (!E.ps[p]) { const d = (padrao && padrao[p]) || [1, -10, 10, 0.1]; E.ps[p] = { v: d[0], min: d[1], max: d[2], passo: d[3] }; } }); }

    /* ---------- lista de funções (cada linha é montada uma vez; depois só os pedaços mudam, para o campo não perder o foco) ---------- */
    function linha(f) { const d = document.createElement("div"); d.className = "gf-f"; d.dataset.id = f.id; d.style.setProperty("--c", cor(f));
      d.innerHTML = `<div class="gf-l1"><button type="button" class="gf-ib gf-olho" data-a="olho" aria-pressed="${f.vis}" title="Mostrar ou esconder" aria-label="Mostrar ou esconder esta função"><i></i></button><input type="text" value="${esc(f.txt)}" placeholder="y = x² − 3x + 2" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Função"><button type="button" class="gf-ib" data-a="der" aria-pressed="${f.der}" title="Desenhar a derivada" aria-label="Desenhar a derivada">f′</button><button type="button" class="gf-ib" data-a="area" aria-pressed="${f.area.on}" title="Pintar a área e calcular a integral" aria-label="Pintar a área e calcular a integral">∫</button><button type="button" class="gf-ib" data-a="apaga" title="Apagar esta função" aria-label="Apagar esta função">✕</button></div><div class="gf-tex"></div><div class="gf-erro" hidden></div><div class="gf-extra gf-xd" hidden></div><div class="gf-extra gf-xa" hidden></div>`;
      return d; }
    function pintaLinha(f) { const d = lista.querySelector(`[data-id="${f.id}"]`); if (!d) return; d.classList.toggle("erro", !!f.erro); d.classList.toggle("oculta", !f.vis);
      const t = d.querySelector(".gf-tex"), e = d.querySelector(".gf-erro");
      if (f.lida) { const tx = G.tex(f.lida); if (t.dataset.tex !== tx) { t.dataset.tex = tx; try { t.innerHTML = window.katex ? katex.renderToString(tx, { throwOnError: false, strict: "ignore" }) : esc(f.txt); } catch (x) { t.textContent = f.txt; } } } else { t.innerHTML = ""; t.dataset.tex = ""; }
      if (f.erro) { const a = Math.min(f.erro.pos, f.txt.length), b = Math.min(a + f.erro.tam, f.txt.length); e.hidden = false; e.innerHTML = `<code>${esc(f.txt.slice(0, a))}<mark>${esc(f.txt.slice(a, b)) || "&nbsp;"}</mark>${esc(f.txt.slice(b))}</code><span>${esc(f.erro.msg)}</span>`; } else { e.hidden = true; e.innerHTML = ""; }
      d.querySelector("[data-a=olho]").setAttribute("aria-pressed", f.vis); d.querySelector("[data-a=der]").setAttribute("aria-pressed", f.der); d.querySelector("[data-a=area]").setAttribute("aria-pressed", f.area.on);
      const seq = f.lida && f.lida.tipo === "sequencia"; d.querySelector("[data-a=der]").disabled = !!seq; d.querySelector("[data-a=area]").disabled = !!seq;
      const xd = d.querySelector(".gf-xd"); xd.hidden = !(f.der && f.lida && !seq); if (!xd.hidden && !xd.innerHTML) xd.innerHTML = `<span>Derivada desenhada em <b>tracejado</b> (calculada numericamente).</span>`;
      const xa = d.querySelector(".gf-xa"); const on = f.area.on && f.lida && !seq; xa.hidden = !on;
      if (on && !xa.querySelector("input")) { xa.innerHTML = `<span>área de x =</span><input type="text" data-l="a" value="${esc(f.area.a)}" inputmode="text" autocapitalize="off" spellcheck="false" aria-label="início do intervalo"><span>até</span><input type="text" data-l="b" value="${esc(f.area.b)}" inputmode="text" autocapitalize="off" spellcheck="false" aria-label="fim do intervalo"><span class="gf-val"></span>`; }
      if (on) pintaArea(f); }
    function pintaArea(f) { const d = lista.querySelector(`[data-id="${f.id}"]`), v = d && d.querySelector(".gf-xa .gf-val"); if (!v) return; const r = areaDe(f); v.innerHTML = r.txt; }
    function areaDe(f) { const p = P(), a = numDe(f.area.a, p), b = numDe(f.area.b, p); if (!Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, txt: "Escreva dois números nos limites (vale 2,5 e também π/2)." };
      const g = (x) => f.f(x, p), r = G.integral(g, a, b); if (!r.ok) return { ok: false, a, b, txt: r.motivo === "assintota" ? "Há uma assíntota dentro do intervalo: a integral não é calculada aqui." : "A função não existe em todo o intervalo: a integral não é calculada." };
      const m = G.integral((x) => Math.abs(g(x)), a, b), muda = m.ok && Math.abs(Math.abs(r.v) - m.v) > 1e-9 * (1 + m.v);
      return { ok: true, a, b, v: r.v, abs: m.ok ? m.v : NaN, txt: `integral de ${G.num(a)} a ${G.num(b)}: <b>${G.num(r.v, 5)}</b>${muda ? ` · área pintada, sem sinal: <b>${G.num(m.v, 5)}</b> (a curva cruza o eixo x)` : ""}` }; }
    function montaLista() { lista.innerHTML = ""; E.fs.forEach((f) => { lista.appendChild(linha(f)); pintaLinha(f); }); }

    /* ---------- parâmetros ---------- */
    let chaveParams = "";
    function pintaParams(forca) { const us = usados(), ch = us.join("|"); const cx = q(".gf-ps");
      if (ch === chaveParams && !forca) return; chaveParams = ch;
      cx.innerHTML = us.length ? us.map((p) => { const o = E.ps[p]; return `<div class="gf-p" data-p="${esc(p)}"><span class="gf-nome">${esc(p)}</span><input type="range" min="${o.min}" max="${o.max}" step="${o.passo}" value="${o.v}" aria-label="valor de ${esc(p)}"><output>${G.num(o.v)}</output><div class="gf-pl"><label>mín <input type="text" data-k="min" value="${G.num(o.min).replace("−", "-")}" inputmode="decimal" aria-label="mínimo de ${esc(p)}"></label><label>máx <input type="text" data-k="max" value="${G.num(o.max).replace("−", "-")}" inputmode="decimal" aria-label="máximo de ${esc(p)}"></label><label>passo <input type="text" data-k="passo" value="${G.num(o.passo)}" inputmode="decimal" aria-label="passo de ${esc(p)}"></label></div></div>`; }).join("") : `<p class="gf-vazio">Escreva uma letra na função (por exemplo y = a·x² + b) e o controle dela aparece aqui. Letras russas também valem: Ж, Ф, Я, Ш…</p>`; }

    /* ---------- vista ---------- */
    const tam = () => ({ w: cv.clientWidth || 600, h: cv.clientHeight || 400 });
    const vistaInicial = () => { const { w } = tam(), e = w / 20; return { cx: 0, cy: 0, ex: e, ey: e }; };
    if (!E.vista) E.vista = null;
    const V = () => E.vista || (E.vista = vistaInicial());
    const px = (x) => tam().w / 2 + (x - V().cx) * V().ex, py = (y) => tam().h / 2 - (y - V().cy) * V().ey;
    const ux = (X) => V().cx + (X - tam().w / 2) / V().ex, uy = (Y) => V().cy - (Y - tam().h / 2) / V().ey;
    const limites = () => { const { w, h } = tam(); return { x0: ux(0), x1: ux(w), y0: uy(h), y1: uy(0) }; };
    function zoom(k, X, Y, eixo) { const v = V(), { w, h } = tam(); if (X === undefined) { X = w / 2; Y = h / 2; } const x = ux(X), y = uy(Y);
      if (eixo !== "y") v.ex = Math.max(1e-7, Math.min(1e9, v.ex * k)); if (eixo !== "x") v.ey = Math.max(1e-7, Math.min(1e9, v.ey * k));
      v.cx = x - (X - w / 2) / v.ex; v.cy = y + (Y - h / 2) / v.ey; mudou(); }

    /* ---------- desenho ---------- */
    const tinta = () => { const c = getComputedStyle(cv), v = (n, d) => c.getPropertyValue(n).trim() || d; const o = { ink: v("--ink", "#e6e9ef"), ink2: v("--ink2", "#aab2c0"), ink3: v("--ink3", "#7a8394"), line: v("--line", "#2a3140"), line2: v("--line2", "#3a4354"), bg: v("--bg", "#0d1117"), card: v("--card", "#161b26") }; CORES.forEach((k) => (o[k] = v(k, "#6f8dff"))); return o; };
    let T = null;
    function eixos(t) { const { w, h } = tam(), L = limites(), v = V();
      const passoX = E.pi ? (() => { const alvo = 80 / v.ex; for (const k of [1 / 12, 1 / 6, 1 / 4, 1 / 2, 1, 2, 4, 8, 16, 32, 64, 128, 256]) if (k * Math.PI >= alvo) return k * Math.PI; return G.passo(alvo); })() : G.passo(80 / v.ex), passoY = G.passo(60 / v.ey);
      ctx.lineWidth = 1; ctx.font = "12px Inter, system-ui, sans-serif";
      const grade = (passo, horiz) => { const a = horiz ? L.y0 : L.x0, b = horiz ? L.y1 : L.x1, sub = passo / 5; ctx.strokeStyle = t.line; ctx.globalAlpha = 0.45; ctx.beginPath(); for (let u = Math.ceil(a / sub) * sub; u <= b; u += sub) { if (horiz) { const Y = Math.round(py(u)) + 0.5; ctx.moveTo(0, Y); ctx.lineTo(w, Y); } else { const X = Math.round(px(u)) + 0.5; ctx.moveTo(X, 0); ctx.lineTo(X, h); } } ctx.stroke(); ctx.globalAlpha = 1; ctx.strokeStyle = t.line2; ctx.beginPath(); for (let i = Math.ceil(a / passo); i * passo <= b; i++) { const u = i * passo; if (horiz) { const Y = Math.round(py(u)) + 0.5; ctx.moveTo(0, Y); ctx.lineTo(w, Y); } else { const X = Math.round(px(u)) + 0.5; ctx.moveTo(X, 0); ctx.lineTo(X, h); } } ctx.stroke(); };
      grade(passoX, false); grade(passoY, true);
      /* eixos */ const X0 = Math.round(px(0)) + 0.5, Y0 = Math.round(py(0)) + 0.5; ctx.strokeStyle = t.ink2; ctx.lineWidth = 1.5; ctx.beginPath(); if (Y0 >= 0 && Y0 <= h) { ctx.moveTo(0, Y0); ctx.lineTo(w, Y0); } if (X0 >= 0 && X0 <= w) { ctx.moveTo(X0, 0); ctx.lineTo(X0, h); } ctx.stroke();
      /* números: junto do eixo; se o eixo saiu da tela, grudados na borda */ ctx.fillStyle = t.ink2; const ly = Math.max(14, Math.min(h - 6, Y0 + 15)), lx = Math.max(6, Math.min(w - 6, X0 - 6)), aDir = X0 - 6 < 30;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; const fundo = (txt, X, Y, al) => { const m = ctx.measureText(txt).width; ctx.fillStyle = t.bg; ctx.globalAlpha = 0.78; ctx.fillRect(al === "center" ? X - m / 2 - 2 : al === "right" ? X - m - 2 : X - 2, Y - 11, m + 4, 14); ctx.globalAlpha = 1; ctx.fillStyle = t.ink2; ctx.textAlign = al; ctx.fillText(txt, X, Y); };
      for (let i = Math.ceil(L.x0 / passoX); i * passoX <= L.x1; i++) { if (i === 0) continue; const u = i * passoX, X = px(u); if (X < 14 || X > w - 14) continue; fundo(E.pi ? G.emPi(u) || G.num(u, 3) : G.num(u, 6), X, ly, "center"); }
      for (let i = Math.ceil(L.y0 / passoY); i * passoY <= L.y1; i++) { if (i === 0) continue; const u = i * passoY, Y = py(u); if (Y < 12 || Y > h - 8) continue; fundo(G.num(u, 6), aDir ? lx + 12 : lx, Y + 4, aDir ? "left" : "right"); }
      if (X0 > 12 && X0 < w && Y0 > 0 && Y0 < h - 14) fundo("0", X0 - 6, Y0 + 15, "right");
      ctx.fillStyle = t.ink3; ctx.font = "italic 13px Inter, system-ui, sans-serif"; ctx.textAlign = "right"; if (Y0 >= 14 && Y0 <= h) ctx.fillText("x", w - 8, Y0 - 7); ctx.textAlign = "left"; if (X0 >= 0 && X0 <= w - 14) ctx.fillText("y", X0 + 8, 14); }
    function curva(g, t, corC, tracejada) { const { w } = tam(), L = limites(), tr = G.trechos(g, L.x0, L.x1, Math.max(200, Math.round(w * 2)), L.y1 - L.y0), teto = 1e5;
      ctx.strokeStyle = corC; ctx.lineWidth = tracejada ? 1.8 : 2.4; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.setLineDash(tracejada ? [7, 6] : []);
      ctx.beginPath(); tr.forEach((s) => { if (s.length === 1) { const X = px(s[0][0]), Y = py(s[0][1]); ctx.moveTo(X - 0.6, Y); ctx.lineTo(X + 0.6, Y); return; } s.forEach((p, i) => { const X = px(p[0]), Y = Math.max(-teto, Math.min(teto, py(p[1]))); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }); }); ctx.stroke(); ctx.setLineDash([]); return tr; }
    function pintaIntegral(f, g, t) { const r = areaDe(f); if (r.a === undefined || !Number.isFinite(r.a) || !Number.isFinite(r.b)) return; const a = Math.min(r.a, r.b), b = Math.max(r.a, r.b), tr = G.trechos(g, a, b, 600, limites().y1 - limites().y0), Y0 = py(0);
      ctx.fillStyle = t[f.cor]; ctx.globalAlpha = 0.26; tr.forEach((s) => { if (s.length < 2) return; ctx.beginPath(); ctx.moveTo(px(s[0][0]), Y0); s.forEach((p) => ctx.lineTo(px(p[0]), Math.max(-1e5, Math.min(1e5, py(p[1]))))); ctx.lineTo(px(s[s.length - 1][0]), Y0); ctx.closePath(); ctx.fill(); }); ctx.globalAlpha = 1;
      ctx.strokeStyle = t[f.cor]; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); ctx.beginPath(); [a, b].forEach((x) => { const y = g(x); if (Number.isFinite(y)) { ctx.moveTo(px(x), Y0); ctx.lineTo(px(x), py(y)); } }); ctx.stroke(); ctx.setLineDash([]); }
    function pontosSeq(f, g, t) { const L = limites(), a = Math.max(1, Math.ceil(L.x0)), b = Math.floor(L.x1); if (b - a > 4000) return; ctx.fillStyle = t[f.cor]; for (let n = a; n <= b; n++) { const y = g(n); if (!Number.isFinite(y)) continue; const Y = py(y); if (Y < -10 || Y > tam().h + 10) continue; ctx.beginPath(); ctx.arc(px(n), Y, 4, 0, 6.2832); ctx.fill(); } }
    let pts = [], marcado = null;
    function desenha() { const d = Math.min(2, window.devicePixelRatio || 1), { w, h } = tam(); if (cv.width !== Math.round(w * d) || cv.height !== Math.round(h * d)) { cv.width = Math.round(w * d); cv.height = Math.round(h * d); }
      T = tinta(); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, w, h); eixos(T); const p = P();
      E.fs.forEach((f) => { if (!f.f || !f.vis) return; const g = (x) => f.f(x, p);
        if (f.lida.tipo === "sequencia") { pontosSeq(f, g, T); return; }
        if (f.area.on) pintaIntegral(f, g, T); curva(g, T, T[f.cor], false); if (f.der) curva(G.derivada(g), T, T[f.cor], true); });
      /* pontos notáveis */ pts.forEach((o) => { const X = px(o.x), Y = py(o.y); if (X < -5 || X > w + 5 || Y < -5 || Y > h + 5) return; ctx.beginPath(); ctx.arc(X, Y, o === marcado ? 6 : 4, 0, 6.2832); ctx.fillStyle = T.bg; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = o.cor2 ? T.ink : T[o.cor]; ctx.stroke(); if (o === marcado) { ctx.beginPath(); ctx.arc(X, Y, 2.2, 0, 6.2832); ctx.fillStyle = T.ink; ctx.fill(); } });
      if (marcado && marcado.traco) { const X = px(marcado.x), Y = py(marcado.y); ctx.beginPath(); ctx.arc(X, Y, 5, 0, 6.2832); ctx.fillStyle = T[marcado.cor]; ctx.fill(); } }
    /* pontos notáveis do que está na tela (um pouco depois de a vista parar, para não pesar enquanto se arrasta) */
    function calculaPontos() { const L = limites(), p = P(), n = Math.max(600, Math.round(tam().w * 2)), l = [], vis = E.fs.filter((f) => f.f && f.vis && f.lida.tipo === "funcao"), tolY = 6 / V().ey;
      vis.forEach((f) => { const g = (x) => f.f(x, p), ex = G.extremos(g, L.x0, L.x1, n), rz = G.raizes(g, L.x0, L.x1, n);
        rz.forEach((x) => l.push({ x, y: 0, tipo: "raiz", cor: f.cor, id: f.id }));
        ex.forEach((e) => { const naRaiz = Math.abs(e.y) < 1e-9 * (1 + Math.abs(e.x)); if (naRaiz && !rz.some((x) => Math.abs(x - e.x) < 1e-6 * (1 + Math.abs(e.x)))) l.push({ x: e.x, y: 0, tipo: e.tipo === "max" ? "raiz e máximo" : "raiz e mínimo", cor: f.cor, id: f.id }); else if (!naRaiz) l.push({ x: e.x, y: e.y, tipo: e.tipo === "max" ? "máximo" : "mínimo", cor: f.cor, id: f.id }); }); });
      for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) { const a = (x) => vis[i].f(x, p), b = (x) => vis[j].f(x, p); G.intersecoes(a, b, L.x0, L.x1, n).forEach((o) => l.push({ x: o.x, y: o.y, tipo: "interseção", cor: vis[i].cor, cor2: vis[j].cor, id: vis[i].id })); }
      pts = l.filter((o) => Number.isFinite(o.y)).slice(0, 400); ptsVer++; void tolY; sujo = true; }
    const agendaPontos = () => { clearTimeout(ptsT); ptsT = setTimeout(() => { if (vivo) calculaPontos(); }, 140); };
    function mudou(semPontos) { sujo = true; if (!semPontos) agendaPontos(); salva(); }
    const salva = () => { clearTimeout(salvaT); salvaT = setTimeout(() => { if (!vivo) return; try { localStorage.setItem(CHAVE, JSON.stringify({ fs: E.fs.map((f) => ({ txt: f.txt, cor: f.cor, vis: f.vis, der: f.der, area: f.area })), ps: psUsados(), vista: E.vista, pi: E.pi })); } catch (e) {} }, 250); };
    const quadro = () => { if (!vivo) return; if (sujo) { sujo = false; try { desenha(); } catch (e) { /* um erro de desenho nunca pode travar a página */ } } requestAnimationFrame(quadro); };

    /* ---------- o que está embaixo do mouse ou do dedo ---------- */
    const coord = (o) => { const xs = G.num(o.x), ys = G.num(o.y), xp = G.emPi(o.x), yp = G.emPi(o.y); return `(${xs}; ${ys})` + (xp || yp ? `<br><span style="color:var(--ink2)">${xp ? "x = " + xp : ""}${xp && yp ? " · " : ""}${yp ? "y = " + yp : ""}</span>` : ""); };
    function aponta(X, Y, raio) { let m = null, dm = raio; pts.forEach((o) => { const d = Math.hypot(px(o.x) - X, py(o.y) - Y); if (d < dm) { dm = d; m = o; } });
      if (!m) { /* sobre uma curva: mostra o ponto dela */ const x = ux(X), p = P(); let melhor = raio * 0.8; E.fs.forEach((f) => { if (!f.f || !f.vis) return; if (f.lida.tipo === "sequencia") { const n = Math.round(x); if (n < 1) return; const y = f.f(n, p), d = Math.hypot(px(n) - X, py(y) - Y); if (Number.isFinite(y) && d < melhor) { melhor = d; m = { x: n, y, tipo: `${f.lida.nome}${String(n).split("").map((c) => "₀₁₂₃₄₅₆₇₈₉"[+c]).join("")}`, cor: f.cor, traco: true, seq: true }; } return; }
          const y = f.f(x, p); if (!Number.isFinite(y)) return; const d = Math.abs(py(y) - Y); if (d < melhor) { melhor = d; m = { x, y, tipo: "ponto da curva", cor: f.cor, traco: true }; } }); }
      if (m !== marcado && !(m && marcado && m.traco && marcado.traco && m.x === marcado.x && m.cor === marcado.cor)) { marcado = m; sujo = true; }
      else if (m && m.traco) { marcado = m; sujo = true; }
      if (!m) { dica.hidden = true; return null; }
      dica.style.setProperty("--c", `var(${m.cor})`); dica.innerHTML = `<b>${esc(m.tipo)}</b>${m.seq ? `n = ${m.x} · valor ${G.num(m.y)}` : coord(m)}`; dica.hidden = false;
      const { w, h } = tam(), dw = dica.offsetWidth, dh = dica.offsetHeight; let L = px(m.x) + 12, Tp = py(m.y) - dh - 10; if (L + dw > w - 4) L = px(m.x) - dw - 12; if (L < 4) L = 4; if (Tp < 4) Tp = py(m.y) + 14; if (Tp + dh > h - 4) Tp = h - dh - 4; dica.style.left = L + "px"; dica.style.top = Tp + "px"; return m; }

    /* ---------- mouse, roda e toque ---------- */
    const dedos = new Map(); let arr = null, pin = null;
    const pos = (e) => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
    cv.addEventListener("pointerdown", (e) => { dedos.set(e.pointerId, pos(e)); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
      if (dedos.size === 2) { const v = [...dedos.values()]; pin = { d: Math.hypot(v[0][0] - v[1][0], v[0][1] - v[1][1]) || 1, m: [(v[0][0] + v[1][0]) / 2, (v[0][1] + v[1][1]) / 2] }; arr = null; }
      else if (dedos.size === 1) { arr = { p: pos(e), andou: 0, toque: e.pointerType !== "mouse" }; cv.classList.add("arr"); } });
    cv.addEventListener("pointermove", (e) => { const p = pos(e);
      if (!dedos.has(e.pointerId)) { if (e.pointerType === "mouse") aponta(p[0], p[1], 14); return; }
      dedos.set(e.pointerId, p);
      if (pin && dedos.size >= 2) { const v = [...dedos.values()], d = Math.hypot(v[0][0] - v[1][0], v[0][1] - v[1][1]) || 1, m = [(v[0][0] + v[1][0]) / 2, (v[0][1] + v[1][1]) / 2]; const vv = V(); vv.cx -= (m[0] - pin.m[0]) / vv.ex; vv.cy += (m[1] - pin.m[1]) / vv.ey; zoom(d / pin.d, m[0], m[1]); pin = { d, m }; dica.hidden = true; return; }
      if (!arr) return; const dx = p[0] - arr.p[0], dy = p[1] - arr.p[1]; arr.andou += Math.abs(dx) + Math.abs(dy); arr.p = p; if (arr.andou < 4) return; const v = V(); v.cx -= dx / v.ex; v.cy += dy / v.ey; dica.hidden = true; marcado = null; mudou(); });
    const solta = (e) => { const tinha = dedos.has(e.pointerId); dedos.delete(e.pointerId); if (pin) { if (dedos.size < 2) pin = null; if (dedos.size === 1) arr = { p: [...dedos.values()][0], andou: 99, toque: true }; else arr = null; cv.classList.remove("arr"); return; }
      if (arr && tinha && arr.andou < 6) { /* toque ou clique parado: marca o ponto mais perto */ aponta(arr.p[0], arr.p[1], arr.toque ? 26 : 14); } arr = null; cv.classList.remove("arr"); };
    cv.addEventListener("pointerup", solta); cv.addEventListener("pointercancel", (e) => { dedos.delete(e.pointerId); pin = null; arr = null; cv.classList.remove("arr"); });
    cv.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse" && !arr) { dica.hidden = true; if (marcado) { marcado = null; sujo = true; } } });
    cv.addEventListener("wheel", (e) => { e.preventDefault(); const p = pos(e), k = Math.pow(1.0018, -e.deltaY * (e.deltaMode === 1 ? 33 : 1)); zoom(Math.max(0.5, Math.min(2, k)), p[0], p[1], e.shiftKey ? "x" : e.altKey ? "y" : undefined); dica.hidden = true; }, { passive: false });
    cv.addEventListener("dblclick", () => { E.vista = vistaInicial(); mudou(); });
    cv.addEventListener("keydown", (e) => { const v = V(), passo = 40; if (e.key === "ArrowLeft") v.cx -= passo / v.ex; else if (e.key === "ArrowRight") v.cx += passo / v.ex; else if (e.key === "ArrowUp") v.cy += passo / v.ey; else if (e.key === "ArrowDown") v.cy -= passo / v.ey; else if (e.key === "+" || e.key === "=") return zoom(1.25); else if (e.key === "-") return zoom(0.8); else if (e.key === "0") { E.vista = vistaInicial(); return mudou(); } else return; e.preventDefault(); mudou(); });
    q(".gf-bts").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; const k = b.dataset.v; if (k === "+") zoom(1.4); else if (k === "-") zoom(1 / 1.4); else if (k === "0") { E.vista = vistaInicial(); mudou(); } else if (k === "y+") zoom(1.4, undefined, undefined, "y"); else if (k === "y-") zoom(1 / 1.4, undefined, undefined, "y"); else if (k === "pi") { E.pi = !E.pi; b.setAttribute("aria-pressed", E.pi); mudou(true); } });
    q("[data-v=pi]").setAttribute("aria-pressed", E.pi);

    /* ---------- painel da esquerda ---------- */
    const achaF = (alvo) => { const d = alvo.closest(".gf-f"); return d ? E.fs.find((f) => f.id === +d.dataset.id) : null; };
    lista.addEventListener("input", (e) => { const f = achaF(e.target); if (!f) return;
      if (e.target.matches(".gf-l1 input")) { f.txt = e.target.value; interpreta(f); garanteParams(); pintaLinha(f); pintaParams(); mudou(); }
      else if (e.target.dataset.l) { f.area[e.target.dataset.l] = e.target.value; pintaArea(f); mudou(true); } });
    lista.addEventListener("focusin", (e) => { if (e.target.matches("input[type=text]")) foco = e.target; });
    lista.addEventListener("click", (e) => { const b = e.target.closest("[data-a]"), f = b && achaF(b); if (!f) return; const a = b.dataset.a;
      if (a === "olho") f.vis = !f.vis; else if (a === "der") f.der = !f.der;
      else if (a === "area") { f.area.on = !f.area.on; if (f.area.on && f.f && f.area.a === "0" && f.area.b === "1") { const L = limites(), p = P(), r = G.raizes((x) => f.f(x, p), L.x0, L.x1, 1200); if (r.length >= 2) { f.area.a = G.num(r[0]).replace("−", "-"); f.area.b = G.num(r[1]).replace("−", "-"); const xa = lista.querySelector(`[data-id="${f.id}"] .gf-xa`); if (xa) xa.innerHTML = ""; } } }
      else if (a === "apaga") { E.fs = E.fs.filter((x) => x !== f); if (!E.fs.length) E.fs.push(nova("")); montaLista(); pintaParams(); mudou(); return; }
      pintaLinha(f); pintaParams(); mudou(); });
    q(".gf-acoes").addEventListener("click", (e) => { const b = e.target.closest("[data-a]"); if (!b) return; if (b.dataset.a === "mais") { if (E.fs.length >= 24) return; const f = nova(""); E.fs.push(f); lista.appendChild(linha(f)); pintaLinha(f); const i = lista.querySelector(`[data-id="${f.id}"] input`); if (i) i.focus(); mudou(); } else { confirma = true; q(".gf-conf").hidden = false; } });
    q(".gf-conf").addEventListener("click", (e) => { const b = e.target.closest("[data-a]"); if (!b) return; q(".gf-conf").hidden = true; confirma = false; if (b.dataset.a !== "sim") return;
      clearTimeout(salvaT); try { localStorage.removeItem(CHAVE); } catch (x) {} E.fs = [nova("")]; E.ps = {}; E.vista = vistaInicial(); E.pi = false; q("[data-v=pi]").setAttribute("aria-pressed", false); pts = []; marcado = null; dica.hidden = true; montaLista(); pintaParams(true); sujo = true; /* depois de limpar nada é gravado até a próxima mudança: a chave fica mesmo apagada */ });
    q(".gf-tecl").addEventListener("mousedown", (e) => { if (e.target.closest("button")) e.preventDefault(); /* o campo não perde o foco */ });
    q(".gf-tecl").addEventListener("click", (e) => { const b = e.target.closest("[data-t]"); if (!b) return; let i = foco && document.contains(foco) && foco.closest(".gf-l1") ? foco : lista.querySelector(".gf-l1 input"); if (!i) return; const t = b.dataset.t, a = i.selectionStart == null ? i.value.length : i.selectionStart, z = i.selectionEnd == null ? a : i.selectionEnd; i.value = i.value.slice(0, a) + t + i.value.slice(z); if (!cel()) i.focus(); try { i.setSelectionRange(a + t.length, a + t.length); } catch (x) {} i.dispatchEvent(new Event("input", { bubbles: true })); });
    q(".gf-mods").addEventListener("click", (e) => { const b = e.target.closest("[data-m]"); if (!b) return; const m = MODELOS.find((x) => x[0] === b.dataset.m); let f = E.fs.find((x) => !x.txt.trim()); if (!f) { if (E.fs.length >= 24) return; f = nova(""); E.fs.push(f); lista.appendChild(linha(f)); } f.txt = m[2]; interpreta(f); garanteParams(m[3]); const i = lista.querySelector(`[data-id="${f.id}"] input`); if (i) i.value = f.txt; pintaLinha(f); pintaParams(); if (m[0] === "pa" || m[0] === "pg") { const v = V(), { w, h } = tam(); if (ux(w) < 6 || ux(0) > 4) { v.cx = 5; } void h; } mudou(); });
    q(".gf-ps").addEventListener("input", (e) => { const d = e.target.closest(".gf-p"); if (!d) return; const o = E.ps[d.dataset.p]; if (!o) return;
      if (e.target.type === "range") { o.v = +e.target.value; d.querySelector("output").textContent = G.num(o.v); }
      else { const v = parseFloat(e.target.value.replace(",", ".").replace("−", "-")), k = e.target.dataset.k; if (!Number.isFinite(v)) return; if (k === "passo" && v <= 0) return; if (k === "min" && v >= o.max) return; if (k === "max" && v <= o.min) return; o[k] = v; const r = d.querySelector("input[type=range]"); r.min = o.min; r.max = o.max; r.step = o.passo; if (o.v < o.min) o.v = o.min; if (o.v > o.max) o.v = o.max; r.value = o.v; d.querySelector("output").textContent = G.num(o.v); }
      E.fs.forEach((f) => { if (f.area.on && f.f) pintaArea(f); }); mudou(); });

    /* ---------- começo ---------- */
    mostraAviso(); /* no celular a curva e o campo de digitação não cabem juntos na tela, e os campos de mínimo, máximo e passo ficam apertados */
    E.fs.forEach(interpreta); garanteParams(MODELOS.reduce((o, m) => Object.assign(o, m[3]), {})); montaLista(); pintaParams(true);
    const ro = window.ResizeObserver ? new ResizeObserver(() => { sujo = true; agendaPontos(); }) : null; if (ro) ro.observe(cv);
    const tema = new MutationObserver(() => (sujo = true)); tema.observe(document.documentElement, { attributes: true, attributeFilter: ["data-tema", "class", "style"] });
    F.aoSair(() => { vivo = false; clearTimeout(ptsT); if (salvaT) { clearTimeout(salvaT); try { if (localStorage.getItem(CHAVE) !== null || E.fs.some((f) => f.txt.trim())) localStorage.setItem(CHAVE, JSON.stringify({ fs: E.fs.map((f) => ({ txt: f.txt, cor: f.cor, vis: f.vis, der: f.der, area: f.area })), ps: psUsados(), vista: E.vista, pi: E.pi })); } catch (e) {} } if (ro) ro.disconnect(); tema.disconnect(); document.body.classList.remove("pg-ferramenta"); });
    requestAnimationFrame(() => { if (!vivo) return; if (!E.vista) E.vista = vistaInicial(); calculaPontos(); quadro(); });
    pagina._ult = { E, G, estado: () => ({ fs: E.fs.map((f) => ({ id: f.id, txt: f.txt, ok: !!f.f, erro: f.erro, vis: f.vis, der: f.der, area: Object.assign({}, f.area), tipo: f.lida && f.lida.tipo, cor: f.cor })), ps: JSON.parse(JSON.stringify(E.ps)), vista: Object.assign({}, V()), limites: limites(), pi: E.pi, pts: pts.map((o) => ({ x: o.x, y: o.y, tipo: o.tipo, id: o.id })), ptsVer, marcado: marcado && { x: marcado.x, y: marcado.y, tipo: marcado.tipo } }),
      px, py, ux, uy, area: (id) => areaDe(E.fs.find((f) => f.id === id)), pontosJa: () => { clearTimeout(ptsT); calculaPontos(); desenha(); sujo = false; }, aviso: mostraAviso,
      trechos: (id, der) => { const f = E.fs.find((x) => x.id === id), p = P(), L = limites(), g = (x) => f.f(x, p); return G.trechos(der ? G.derivada(g) : g, L.x0, L.x1, Math.max(200, Math.round(tam().w * 2)), L.y1 - L.y0); } };
    void confirma;
  }
  window.PAGINAS = window.PAGINAS || {}; window.PAGINAS.graficos = pagina;
})();
