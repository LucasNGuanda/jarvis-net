/* Kit de desenho em SVG para figuras de física (circuitos, setas, eixos).
   Tudo é string de SVG; as cores vêm do CSS (tema claro/escuro). */
(function () {
  const D = (window.D = {});
  const f = (v) => +v.toFixed(2);

  D.svg = (w, h, inner, aria = "figura", estilo = "") =>
    `<svg viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${aria}" style="${estilo}">${inner}</svg>`;
  D.fio = (pts, cls = "ln") => `<polyline class="${cls}" points="${pts.map((p) => p.join(",")).join(" ")}"/>`;
  D.no = (x, y) => `<circle cx="${x}" cy="${y}" r="3.6" style="fill:var(--ink)"/>`;
  D.borne = (x, y) => `<circle cx="${x}" cy="${y}" r="4" style="fill:var(--card);stroke:var(--ink);stroke-width:2"/>`;
  D.txt = (x, y, s, cls = "tx", anc = "middle", extra = "") => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anc}" ${extra}>${s}</text>`;

  // seta de (x1,y1) até (x2,y2)
  D.seta = (x1, y1, x2, y2, cor = "var(--mod)", w = 2.2) => {
    const a = Math.atan2(y2 - y1, x2 - x1), s = 9;
    const p1 = [x2 - s * Math.cos(a - 0.4), y2 - s * Math.sin(a - 0.4)], p2 = [x2 - s * Math.cos(a + 0.4), y2 - s * Math.sin(a + 0.4)];
    return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2 - 5 * Math.cos(a))}" y2="${f(y2 - 5 * Math.sin(a))}" style="stroke:${cor};stroke-width:${w}"/><polygon points="${f(x2)},${f(y2)} ${f(p1[0])},${f(p1[1])} ${f(p2[0])},${f(p2[1])}" style="fill:${cor}"/>`;
  };

  // corpo de cada componente desenhado no eixo x, centrado em 0, ocupando [-L/2, L/2]
  const CORPO = {
    resistor: (L) => {
      const n = 6, a = 7, w = L; let d = `M${-w / 2} 0`;
      for (let i = 0; i < n; i++) d += ` L${f(-w / 2 + (w * (i + 0.5)) / n)} ${i % 2 ? a : -a}`;
      return `<path class="ln" d="${d} L${w / 2} 0"/>`;
    },
    resistorCaixa: (L) => `<rect x="${-L / 2}" y="-8" width="${L}" height="16" rx="2" class="ln" style="fill:var(--card)"/>`,
    bateria: (L, o) => {
      // placa longa (+) do lado o.mais (-1 = começo, +1 = fim)
      const s = o.mais === -1 ? -1 : 1;
      return `<line x1="${-s * 4}" y1="-15" x2="${-s * 4}" y2="15" class="ln"/><line x1="${s * 4}" y1="-8" x2="${s * 4}" y2="8" class="ln" style="stroke-width:4"/>
        <line x1="${-L / 2}" y1="0" x2="${-4}" y2="0" class="ln"/><line x1="4" y1="0" x2="${L / 2}" y2="0" class="ln"/>`;
    },
    led: (L) => `<polygon points="-9,-10 -9,10 8,0" class="ln" style="fill:var(--card)"/><line x1="8" y1="-10" x2="8" y2="10" class="ln"/>
      <line x1="${-L / 2}" y1="0" x2="-9" y2="0" class="ln"/><line x1="8" y1="0" x2="${L / 2}" y2="0" class="ln"/>
      <path d="M0 -13 l6 -8 M2 -21 l4 0 0 4 M7 -12 l6 -8 M9 -20 l4 0 0 4" style="stroke:var(--ink);stroke-width:1.4;fill:none"/>`,
    lampada: () => `<circle r="11" class="ln" style="fill:var(--card)"/><path d="M-7.8 -7.8 L7.8 7.8 M-7.8 7.8 L7.8 -7.8" class="ln" style="stroke-width:1.6"/>`,
    medidor: () => `<circle r="12" class="ln" style="fill:var(--card)"/>`,
    vazio: () => "",
  };
  const COMPR = { resistor: 44, resistorCaixa: 40, bateria: 8, led: 20, lampada: 22, medidor: 24, vazio: 0 };

  // componente entre dois pontos: liga com fio até o corpo
  D.comp = (tipo, x1, y1, x2, y2, o = {}) => {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    const L = o.L || COMPR[tipo], cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
    const ux = dx / len, uy = dy / len;
    let s = "";
    if (tipo !== "bateria") {
      s += `<line class="ln" x1="${x1}" y1="${y1}" x2="${f(cx - ux * L / 2)}" y2="${f(cy - uy * L / 2)}"/>`;
      s += `<line class="ln" x1="${f(cx + ux * L / 2)}" y1="${f(cy + uy * L / 2)}" x2="${x2}" y2="${y2}"/>`;
    } else {
      s += `<line class="ln" x1="${x1}" y1="${y1}" x2="${f(cx - ux * 4)}" y2="${f(cy - uy * 4)}"/><line class="ln" x1="${f(cx + ux * 4)}" y1="${f(cy + uy * 4)}" x2="${x2}" y2="${y2}"/>`;
    }
    s += `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(ang)})" ${o.cor ? `style="--ink:${o.cor}"` : ""}>${CORPO[tipo](tipo === "bateria" ? 8 : L, o)}</g>`;
    if (tipo === "medidor") s += `<text x="${f(cx)}" y="${f(cy + 5)}" text-anchor="middle" class="tx" style="font-weight:700">${o.letra || "A"}</text>`;
    if (o.rot) {
      // rótulo do lado "lado" (+1 = esquerda de quem anda de 1 para 2)
      const lado = o.lado || 1, dist = o.dist || (tipo === "bateria" ? 26 : 22);
      const nx = uy * lado, ny = -ux * lado;
      const tx = cx + nx * dist, ty = cy + ny * dist + 5;
      const anc = Math.abs(nx) < 0.3 ? "middle" : nx > 0 ? "start" : "end";
      s += `<text class="${o.cls || "tx"}" x="${f(tx)}" y="${f(ty)}" text-anchor="${anc}">${o.rot}</text>`;
    }
    if (tipo === "bateria" && o.sinais !== false) {
      const sg = o.mais === -1 ? -1 : 1, lado = o.lado || 1, nx = uy * -lado, ny = -ux * -lado;
      s += `<text class="tx2" x="${f(cx + ux * 13 * sg + nx * 14)}" y="${f(cy + uy * 13 * sg + ny * 14 + 4)}" text-anchor="middle">+</text>`;
    }
    return s;
  };

  // eixos de gráfico simples. o = {x0,y0,w,h, xlab, ylab}
  D.eixos = (o) => D.seta(o.x0, o.y0, o.x0 + o.w, o.y0, "var(--ink2)", 1.4) + D.seta(o.x0, o.y0, o.x0, o.y0 - o.h, "var(--ink2)", 1.4) +
    (o.xlab ? D.txt(o.x0 + o.w, o.y0 + 18, o.xlab, "txm", "end") : "") + (o.ylab ? D.txt(o.x0 - 8, o.y0 - o.h + 4, o.ylab, "txm", "end") : "");

  // cilindro (fio) visto de lado: comprimento L, raio r, em (x,y) centro esquerdo
  D.cilindro = (x, y, L, r, cls = "preen") =>
    `<path class="${cls}" d="M${x} ${y - r} L${x + L} ${y - r} A${r * 0.35} ${r} 0 0 1 ${x + L} ${y + r} L${x} ${y + r} A${r * 0.35} ${r} 0 0 1 ${x} ${y - r} Z"/><ellipse class="${cls}" cx="${x}" cy="${y}" rx="${r * 0.35}" ry="${r}"/>`;
  /* carrinho visto de lado: centro da base em (x, y); dir = 1 (para a direita) ou −1; cor = variável CSS (β 3.1, Mecânica) */
  D.carro = (x, y, cor = "var(--mA)", dir = 1, rot = "") => {
    const w = 46, h = 18;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${dir} 1)"><path d="M${-w / 2} ${-6} L${-w / 2} ${-h} L${-6} ${-h} L${4} ${-h - 10} L${16} ${-h - 10} L${w / 2} ${-h} L${w / 2} ${-6} Z" style="fill:color-mix(in srgb,${cor} 30%,transparent);stroke:${cor};stroke-width:2"/><circle cx="${-w / 2 + 10}" cy="-5" r="5" style="fill:var(--ink)"/><circle cx="${w / 2 - 10}" cy="-5" r="5" style="fill:var(--ink)"/></g>` + (rot ? D.txt(x, y - h - 16, rot, "tx2") : "");
  };
  /* estrada reta com marcas a cada "passo" unidades: de x0 a x1 (px), na altura y; esc = px por unidade; origem em x0 */
  D.estrada = (x0, x1, y, esc, passo, un = "m", rotulos = true) => {
    let s = `<line x1="${x0 - 10}" y1="${y}" x2="${x1 + 10}" y2="${y}" style="stroke:var(--ink2);stroke-width:2"/>`;
    for (let u = 0; x0 + u * esc <= x1 + 0.1; u += passo) { const px = f(x0 + u * esc); s += `<line x1="${px}" y1="${y - 4}" x2="${px}" y2="${y + 4}" style="stroke:var(--ink3)"/>` + (rotulos ? D.txt(px, y + 18, String(u).replace(".", ","), "tx2") : ""); }
    return s + (rotulos ? D.txt(x1 + 14, y + 18, un, "tx2", "start") : "");
  };
  /* gráfico simples: o = {x0, y0, w, h, xmax, ymin, ymax, xlab, ylab, xt:[ticks], yt:[ticks], curvas:[{pts:[[x,y]...], cor, area, trac}], pontos:[[x,y,rot]]} */
  D.graf = (o) => {
    const ymin = o.ymin || 0, X = (x) => o.x0 + (x / o.xmax) * o.w, Y = (y) => o.y0 - ((y - ymin) / (o.ymax - ymin)) * o.h, y0 = Y(Math.max(ymin, 0));
    let s = D.seta(o.x0, y0, o.x0 + o.w + 14, y0, "var(--ink2)", 1.4) + D.seta(o.x0, o.y0 + 4, o.x0, o.y0 - o.h - 14, "var(--ink2)", 1.4);
    (o.xt || []).forEach((t) => (s += `<line x1="${f(X(t))}" y1="${f(y0 - 3)}" x2="${f(X(t))}" y2="${f(y0 + 3)}" style="stroke:var(--ink3)"/>` + D.txt(X(t), y0 + 17, String(t).replace(".", ","), "tx2")));
    (o.yt || []).forEach((t) => (s += `<line x1="${o.x0 - 3}" y1="${f(Y(t))}" x2="${o.x0 + o.w}" y2="${f(Y(t))}" style="stroke:var(--line2);stroke-dasharray:3 4"/>` + D.txt(o.x0 - 6, Y(t) + 4, String(t).replace(".", ",").replace("-", "−"), "tx2", "end")));
    (o.curvas || []).forEach((c) => {
      const d = c.pts.map(([x, y], i) => (i ? "L" : "M") + f(X(x)) + " " + f(Y(y))).join(" ");
      if (c.area) s += `<path d="${d} L${f(X(c.pts[c.pts.length - 1][0]))} ${f(y0)} L${f(X(c.pts[0][0]))} ${f(y0)} Z" style="fill:color-mix(in srgb,${c.cor || "var(--mod)"} 22%,transparent);stroke:none"/>`;
      s += `<path d="${d}" style="fill:none;stroke:${c.cor || "var(--mod)"};stroke-width:2.4${c.trac ? ";stroke-dasharray:6 4" : ""}"/>`;
    });
    (o.pontos || []).forEach(([x, y, r]) => (s += `<circle cx="${f(X(x))}" cy="${f(Y(y))}" r="3.5" style="fill:var(--ink)"/>` + (r ? D.txt(X(x) + 6, Y(y) - 7, r, "tx2", "start") : "")));
    s += (o.xlab ? D.txt(o.x0 + o.w + 14, y0 + 17, o.xlab, "txm", "end") : "") + (o.ylab ? D.txt(o.x0 + 8, o.y0 - o.h - 6, o.ylab, "txm", "start") : "");
    return s;
  };
  /* ---- peças da Termodinâmica (β 3.3) ---- */
  /* bloco/caixa com rótulo no meio */
  D.bloco = (x, y, w, h, cor = "var(--mT)", rot = "") => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="3" style="fill:color-mix(in srgb,${cor} 28%,transparent);stroke:${cor};stroke-width:2"/>` + (rot ? D.txt(x + w / 2, y + h / 2 + 5, rot, "tx2") : "");
  /* termômetro vertical: bulbo embaixo em (x, y), altura h, fração de líquido fr (0–1), rótulo ao lado */
  D.termo = (x, y, h, fr, rot = "", cor = "var(--bad)") => `<rect x="${f(x - 6)}" y="${f(y - h)}" width="12" height="${f(h)}" rx="6" style="fill:var(--bg);stroke:var(--ink3);stroke-width:1.5"/><rect x="${f(x - 2.5)}" y="${f(y - 6 - (h - 10) * fr)}" width="5" height="${f((h - 10) * fr + 6)}" style="fill:${cor}"/><circle cx="${f(x)}" cy="${f(y + 4)}" r="9" style="fill:${cor};stroke:var(--ink3);stroke-width:1.5"/>` + (rot ? D.txt(x + 14, y - h + 12, rot, "tx2", "start") : "");
  /* chama pequena com a base em (x, y) */
  D.chama = (x, y, s = 1) => `<path d="M${f(x)} ${f(y)} c${-9 * s} ${-6 * s} ${-8 * s} ${-16 * s} 0 ${-28 * s} c${2 * s} ${8 * s} ${10 * s} ${10 * s} ${8 * s} ${18 * s} c${-1 * s} ${6 * s} ${-4 * s} ${9 * s} ${-8 * s} ${10 * s} Z" style="fill:var(--warn);opacity:.9"/>`;
  /* cilindro com gás e pistão: canto superior esquerdo (x, y), largura w, altura total h, fração ocupada pelo gás fr; rótulo do gás */
  D.pistao = (x, y, w, h, fr, rot = "gás", cor = "var(--mT)") => {
    const yp = y + h - h * fr;
    return `<path d="M${f(x)} ${f(y)} L${f(x)} ${f(y + h)} L${f(x + w)} ${f(y + h)} L${f(x + w)} ${f(y)}" style="fill:none;stroke:var(--ink2);stroke-width:2.5"/><rect x="${f(x + 2)}" y="${f(yp)}" width="${f(w - 4)}" height="${f(y + h - yp - 1)}" style="fill:color-mix(in srgb,${cor} 22%,transparent)"/><rect x="${f(x + 2)}" y="${f(yp - 10)}" width="${f(w - 4)}" height="10" style="fill:var(--ink3)"/><line x1="${f(x + w / 2)}" y1="${f(yp - 10)}" x2="${f(x + w / 2)}" y2="${f(yp - 34)}" style="stroke:var(--ink3);stroke-width:4"/>` + (rot ? D.txt(x + w / 2, y + h - (h * fr) / 2 + 5, rot, "tx2") : "");
  };
  /* recipiente aberto com líquido até a fração fr */
  D.copo = (x, y, w, h, fr, cor = "var(--mA)") => `<rect x="${f(x)}" y="${f(y + h - h * fr)}" width="${f(w)}" height="${f(h * fr)}" style="fill:color-mix(in srgb,${cor} 25%,transparent)"/><path d="M${f(x)} ${f(y)} L${f(x)} ${f(y + h)} L${f(x + w)} ${f(y + h)} L${f(x + w)} ${f(y)}" style="fill:none;stroke:var(--ink2);stroke-width:2"/>`;
  /* função amostrada para D.graf: pts de f no intervalo [a, b] */
  D.amostra = (fn, a, b, n = 60) => Array.from({ length: n + 1 }, (_, i) => { const x = a + ((b - a) * i) / n; return [x, fn(x)]; });
})();
