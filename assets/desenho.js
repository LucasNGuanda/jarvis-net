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
    medidor: (L, o) => `<circle r="12" class="ln" style="fill:var(--card)"/><text x="0" y="5" text-anchor="middle" class="tx" style="font-weight:700">${o.letra || "A"}</text>`,
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
})();
