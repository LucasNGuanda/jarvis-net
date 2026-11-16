// tfigtexto.js: procura, nas figuras SVG de um tema, texto que sai da figura ou que fica por cima de outro texto da mesma linha.
// Uso: node tests/tfigtexto.js quimica/I01 quimica/I02 ...   (percorre teoria, exemplos e exercícios como estão na primeira versão)
const { chromium } = require('playwright'); const path = require('path');
const RAIZ = 'file://' + path.resolve(__dirname, '..', 'index.html');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); await require('./adm')(p); let falhas = 0;
  for (const cod of process.argv.slice(2)) { await p.goto(RAIZ + '#/' + cod); await p.waitForTimeout(1600);
    const r = await p.evaluate(() => { const ruins = []; let n = 0;
      document.querySelectorAll('main svg, #conteudo svg, .tema svg, body svg').forEach((svg) => { if (svg.closest('.lab, [id^="lab-"], header, nav, .topo')) return; const vb = svg.viewBox && svg.viewBox.baseVal; if (!vb || !vb.width) return; const rs = svg.getBoundingClientRect(), k = rs.width ? vb.width / rs.width : 1; const T = [...svg.querySelectorAll('text')].map((t) => { const q = t.getBoundingClientRect(); return { t: t.textContent.trim(), x: (q.left - rs.left) * k, y: (q.top - rs.top) * k, w: q.width * k, h: q.height * k }; }).filter((q) => q.w > 0 && q.t); if (!T.length) return; n++;
        const sec = (svg.closest('section[id], div[id]') || {}).id || '?';
        T.forEach((q) => { if (q.x < -1 || q.x + q.w > vb.width + 1) ruins.push(`${sec}: fora da figura (${Math.round(q.x)} a ${Math.round(q.x + q.w)} de ${vb.width}): "${q.t.slice(0, 50)}"`); });
        for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) { const a = T[i], c = T[j]; const folga = a.t.length <= 4 && c.t.length <= 4 ? 7 : 2; /* rótulos de átomos vizinhos (curtos) encostam de propósito; texto de tabela, não */ if (Math.abs(a.y - c.y) < 4 && a.x < c.x + c.w - folga && c.x < a.x + a.w - folga && a.t !== c.t) ruins.push(`${sec}: sobreposição: "${a.t.slice(0, 32)}" × "${c.t.slice(0, 32)}"`); } });
      return { n, ruins: [...new Set(ruins)] }; });
    console.log((r.ruins.length ? 'FALHA ' : 'ok ') + cod + ': ' + r.n + ' figuras com texto' + (r.ruins.length ? ', ' + r.ruins.length + ' problema(s)' : ', nenhum texto cortado ou sobreposto')); r.ruins.slice(0, 12).forEach((x) => console.log('   ' + x)); falhas += r.ruins.length; }
  console.log('FALHAS (' + falhas + '):'); await b.close(); process.exit(falhas ? 1 : 0);
})();
