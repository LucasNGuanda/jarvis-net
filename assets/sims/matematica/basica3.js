/* Matemática · módulo MB: potências e raízes (MB03).
   Acrescenta a SIM.mb: fat (fatoração em primos), fatTxt, raiz (√n = k√m, com m sem fator quadrado), rz e rzTxt (escrita de k√m), cient (notação
   científica) e ult (último algarismo de a^n pelo ciclo). Laboratórios: SIM.mbPotencias (a escada das potências, do expoente negativo ao positivo,
   com meio degrau para a raiz), SIM.mbRaizLab (tirar quadrados perfeitos de dentro da raiz) e SIM.mbRacionaliza (racionalizar passo a passo).
   Contas conferidas em Python (tools/matematica/confere-mb.py). */
(function () {
  const SIM = (window.SIM = window.SIM || {}), M = SIM.mb;
  const vis = (r, v) => `<div class="vis"><small>${r}</small><b>${v}</b></div>`;
  const rng = (s) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const SUP = (n) => String(n).split("").map((c) => ({ "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "/": "ᐟ" })[c] || c).join("");
  M.sup = SUP;
  /* fatoração em primos: fat(72) = [[2, 3], [3, 2]] */
  M.fat = (n) => { const o = []; let d = 2; n = Math.abs(Math.round(n)); while (d * d <= n) { let e = 0; while (n % d === 0) { n /= d; e++; } if (e) o.push([d, e]); d++; } if (n > 1) o.push([n, 1]); return o; };
  M.fatTxt = (n) => M.fat(n).map(([p, e]) => (e === 1 ? String(p) : p + SUP(e))).join(" · ") || "1";
  M.fatTex = (n) => M.fat(n).map(([p, e]) => (e === 1 ? String(p) : `${p}^${e}`)).join(" \\cdot ") || "1";
  /* √n = k√m: tira de dentro da raiz todo fator ao quadrado */
  M.raiz = (n) => { let k = 1, m = 1; M.fat(n).forEach(([p, e]) => { k *= p ** Math.floor(e / 2); if (e % 2) m *= p; }); return { k, m }; };
  M.rz = (k, m) => (m === 1 ? String(k) : (k === 1 ? "" : k === -1 ? "-" : String(k)) + `\\sqrt{${m}}`);
  M.rzTxt = (k, m) => (m === 1 ? String(k).replace("-", "−") : (k === 1 ? "" : k === -1 ? "−" : String(k).replace("-", "−")) + `√${m}`);
  /* notação científica de um número positivo: { m (mantissa, 1 ≤ m < 10), e } */
  M.cient = (x) => { const e = Math.floor(Math.log10(x) + 1e-12); return { m: +(x / 10 ** e).toPrecision(6), e }; };
  /* último algarismo de a^n (n ≥ 1): ciclo dos últimos algarismos */
  M.ciclo = (a) => { const o = []; let v = a % 10; while (!o.includes(v)) { o.push(v); v = (v * a) % 10; } return o; };
  M.ult = (a, n) => { const c = M.ciclo(a); return c[(n - 1) % c.length]; };

  /* nome: "A escada das potências: de dividir a multiplicar" · matéria: Matemática · tema: MB03 */
  SIM.mbPotencias = (el, F) => { let a = 2, e = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><label style="font-size:13px;color:var(--ink2)">base <select data-v="a" class="bt peq" style="font-size:15px">${[2, 3, 4, 5, 9, 10].map((x) => `<option>${x}</option>`).join("")}</select></label><label style="font-size:13px;color:var(--ink2)">expoente <input type="range" data-v="e" min="-3" max="4" step="0.5" value="0" style="vertical-align:middle;width:220px"></label></div></div></div><div class="palco" data-v="pal" style="padding:6px 0"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const v = a ** e, int = Number.isInteger(e); return { a, e, v, int, fr: e < 0 && int ? `1/${a ** -e}` : null }; };
    const poe = (o) => { ({ a, e } = { a, e, ...o }); a = +a; e = Math.max(-3, Math.min(4, Math.round(+e * 2) / 2)); desenha(); };
    const desenha = () => { const s = est(); q("[data-v=a]").value = String(a); q("[data-v=e]").value = String(e); const X = (k) => 40 + ((k + 3) / 7) * 480; let o = `<line x1="30" y1="62" x2="530" y2="62" style="stroke:var(--ink3);stroke-width:1.4"/>`;
      for (let k = -3; k <= 4; k++) { const val = k >= 0 ? String(a ** k) : `1/${a ** -k}`, sel = k === e; o += `<circle cx="${X(k)}" cy="62" r="${sel ? 8 : 5}" style="fill:${sel ? "var(--mod)" : "var(--ink3)"}"/><text x="${X(k)}" y="38" text-anchor="middle" style="font:${sel ? 700 : 500} ${val.length > 5 ? 11 : 14}px Inter,system-ui,sans-serif;fill:${sel ? "var(--mod)" : "var(--ink)"}">${val}</text><text x="${X(k)}" y="88" text-anchor="middle" style="font:500 13px Inter,system-ui,sans-serif;fill:var(--ink2)">${a}${SUP(k)}</text>`; if (k < 4) o += `<text x="${(X(k) + X(k + 1)) / 2}" y="112" text-anchor="middle" style="font:500 11px Inter,system-ui,sans-serif;fill:var(--ink3)">×${a} →</text>`; }
      if (!s.int) o += `<circle cx="${X(e)}" cy="62" r="8" style="fill:var(--warn)"/><text x="${X(e)}" y="20" text-anchor="middle" style="font:700 13px Inter,system-ui,sans-serif;fill:var(--warn)">${F.nt(s.v, 3)}</text>`;
      q("[data-v=pal]").innerHTML = `<svg viewBox="0 0 560 124" width="100%" style="max-width:560px">${o}</svg>`;
      q("[data-v=lt]").innerHTML = vis("potência", s.int ? `${a}${SUP(e)}` : `${a} elevado a ${F.nt(e, 1)}`) + vis("valor", s.fr || F.nt(s.v, 4)) + vis("degrau", s.int ? "inteiro" : "meio degrau");
      q("[data-v=st]").innerHTML = s.int ? (e > 0 ? `${a}${SUP(e)}: o número ${a} multiplicado por ele mesmo ${e} ${e === 1 ? "vez (só ele)" : "vezes"}. Cada degrau para a direita multiplica por ${a}; cada degrau para a esquerda divide por ${a}.` : e === 0 ? `Descendo de ${a}¹ = ${a} um degrau, divide-se por ${a}: sobra 1. Por isso ${a}⁰ = 1, e não 0.` : `Continuando a dividir por ${a} depois do 1: ${a}${SUP(e)} = 1/${a ** -e}. Expoente negativo não dá número negativo: dá o inverso.`)
        : `Meio degrau: duas vezes o mesmo fator têm de dar um degrau inteiro, ×${a}. O fator é √${a} ≈ ${F.nt(Math.sqrt(a), 4)}. Então ${a} elevado a ${F.nt(e, 1)} = ${e > 0.5 || e < 0 ? `${a}${SUP(Math.floor(e))} × √${a} = ` : ""}${F.nt(s.v, 4)}: expoente 1/2 é raiz quadrada.`; };
    q("[data-v=a]").addEventListener("change", (ev) => poe({ a: ev.target.value })); q("[data-v=e]").addEventListener("input", (ev) => poe({ e: ev.target.value }));
    SIM.mbPotencias._ult = { poe, est }; desenha(); };

  /* nome: "Tire os quadrados de dentro da raiz" · matéria: Matemática · tema: MB03 */
  SIM.mbRaizLab = (el, F) => { let n = 72, ver = false, r = rng(5);
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><p style="margin:0 0 4px;font-size:13px;color:var(--ink2)">número dentro da raiz (2 a 2000)</p><div class="bts"><input type="number" data-v="n" min="2" max="2000" value="72" class="bt peq" style="width:92px;font-size:15px"><button class="bt peq" data-v="s">sortear</button><button class="bt peq" data-v="ver">mostrar</button></div></div></div><div class="palco" data-v="pal" style="text-align:center;padding:16px 10px"></div><div class="leitor" data-v="lt"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s);
    const est = () => { const z = M.raiz(n), piso = Math.floor(Math.sqrt(n) + 1e-9); return { n, ver, ...z, txt: M.rzTxt(z.k, z.m), fat: M.fatTxt(n), piso, exata: z.m === 1 }; };
    const poe = (v) => { n = Math.max(2, Math.min(2000, Math.round(+v) || 2)); ver = false; desenha(); }, mostra = () => { ver = true; desenha(); };
    const desenha = () => { const e = est(); q("[data-v=n]").value = String(n);
      q("[data-v=pal]").innerHTML = `<div style="font:700 44px/1.2 Inter,system-ui,sans-serif">√${n} = <span style="color:${ver ? "var(--mod)" : "var(--ink3)"}">${ver ? e.txt : "?"}</span></div><div style="font-size:14px;color:var(--ink2);margin-top:8px">${ver ? `${n} = ${e.fat}` : "fatore o número e procure pares de fatores iguais"}</div>`;
      q("[data-v=lt]").innerHTML = vis("fica entre", `${e.piso} e ${e.piso + (e.exata ? 0 : 1)}`) + vis("valor aproximado", ver ? F.nt(Math.sqrt(n), 4) : "?");
      q("[data-v=st]").innerHTML = ver ? (e.exata ? `${n} é um quadrado perfeito: todos os expoentes da fatoração são pares, e a raiz é o inteiro ${e.k}.` : e.k === 1 ? `Na fatoração de ${n} nenhum primo aparece duas vezes: não há quadrado para tirar, e √${n} já está na forma mais simples.` : `Cada par de fatores iguais sai da raiz como um fator só: √${n} = √(${e.k}² · ${e.m}) = ${e.k}√${e.m}. O que fica dentro (${e.m}) não tem mais fator quadrado.`) : `Sem calculadora dá para cercar: ${e.piso}² = ${e.piso ** 2} e ${e.piso + 1}² = ${(e.piso + 1) ** 2}. Diga a forma simplificada e clique em "mostrar".`; };
    q("[data-v=n]").addEventListener("change", (ev) => poe(ev.target.value)); q("[data-v=ver]").addEventListener("click", mostra); q("[data-v=s]").addEventListener("click", () => { const k = 2 + Math.floor(r() * 9), m = [2, 3, 5, 6, 7, 10, 11, 13][Math.floor(r() * 8)]; poe(k * k * m); });
    SIM.mbRaizLab._ult = { poe, mostra, est, semente: (k) => { r = rng(k); } }; desenha(); };

  /* nome: "Racionalize o denominador, passo a passo" · matéria: Matemática · tema: MB03 */
  SIM.mbRacionaliza = (el, F) => { let tipo = 0, a = 6, b = 3, c = 1, passo = 0;
    el.insertAdjacentHTML("beforeend", `<div class="ctrls"><div><div class="bts"><button class="bt peq" data-t="0">a / √b</button><button class="bt peq" data-t="1">a / (√b + c)</button><button class="bt peq" data-v="novo">outros números</button><button class="bt peq" data-v="prox">próximo passo</button></div></div></div><div class="palco" data-v="pal" style="padding:12px 16px"></div><div class="status" data-v="st"></div>`);
    const q = (s) => el.querySelector(s); let r = rng(9);
    /* resultado exato: tipo 0: a√b/b = (a/g)√b / (b/g); tipo 1: a(√b − c)/(b − c²) */
    const est = () => { if (tipo === 0) { const g = M.mdc(a, b); return { tipo, a, b, passo, num: a / g, den: b / g, total: 3, txt: (b / g === 1 ? M.rzTxt(a / g, b) : `${M.rzTxt(a / g, b)} / ${b / g}`), val: a / Math.sqrt(b) }; } const d = b - c * c, g = M.mdc(a, d), s = d < 0 ? -1 : 1; return { tipo, a, b, c, passo, num: (s * a) / g, den: (s * d) / g, total: 3, txt: `${Math.abs(a / g) === 1 ? "" : Math.abs(a / g)}(${s < 0 ? `${c} − √${b}` : `√${b} − ${c}`})${(s * d) / g === 1 ? "" : ` / ${(s * d) / g}`}`, val: a / (Math.sqrt(b) + c) }; };
    const novo = () => { if (tipo === 0) { b = [2, 3, 5, 6, 7][Math.floor(r() * 5)]; a = (1 + Math.floor(r() * 6)) * (r() < 0.6 ? b : 1); } else { let ok = false; while (!ok) { b = [2, 3, 5, 6, 7][Math.floor(r() * 5)]; c = 1 + Math.floor(r() * 3); ok = b !== c * c; } a = 1 + Math.floor(r() * 8); } passo = 0; desenha(); };
    const avanca = () => { if (passo < 3) passo++; desenha(); };
    const desenha = () => { const e = est(); el.querySelectorAll("[data-t]").forEach((x) => x.setAttribute("aria-pressed", String(+x.dataset.t === tipo))); const L = tipo === 0 ? [`${a} / √${b}`, `multiplique em cima e embaixo por √${b}: (${a} · √${b}) / (√${b} · √${b})`, `embaixo, √${b} · √${b} = ${b}: ${a}√${b} / ${b}`, `simplificando: ${e.txt}`] : [`${a} / (√${b} + ${c})`, `multiplique em cima e embaixo pelo conjugado (√${b} − ${c})`, `embaixo, diferença de quadrados: (√${b})² − ${c}² = ${b} − ${c * c} = ${b - c * c}`, `resultado: ${e.txt}`];
      q("[data-v=pal]").innerHTML = `<ol style="max-width:520px;margin:0 auto;font-size:17px;line-height:1.9;text-align:left">${L.slice(0, passo + 1).map((x, i) => `<li style="${i === passo ? "font-weight:700" : "color:var(--ink2)"}">${x}</li>`).join("")}</ol>`;
      q("[data-v=st]").innerHTML = passo < 3 ? (tipo === 0 ? "Multiplicar em cima e embaixo pelo mesmo número não muda o valor da fração; escolhe-se o número que faz a raiz sumir do denominador." : "Com soma no denominador, multiplicar pela própria raiz não resolve. O conjugado resolve, porque (x + y)(x − y) = x² − y² não tem mais raiz.") : `Valor: ${F.nt(e.val, 4)} (confira na calculadora com a forma do começo e com a do fim: dá o mesmo). O denominador ficou inteiro.`; q("[data-v=prox]").disabled = passo >= 3; };
    el.querySelectorAll("[data-t]").forEach((x) => x.addEventListener("click", () => { tipo = +x.dataset.t; novo(); })); q("[data-v=novo]").addEventListener("click", novo); q("[data-v=prox]").addEventListener("click", avanca);
    SIM.mbRacionaliza._ult = { poe: (o) => { ({ tipo, a, b, c } = { tipo, a, b, c, ...o }); passo = 0; desenha(); }, avanca, novo, est, semente: (k) => { r = rng(k); novo(); } }; desenha(); };
})();
