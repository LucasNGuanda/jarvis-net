/* Conta, tema por tema, abrindo o conteúdo de verdade (html(F) de cada tema escrito): exercícios, exercícios sem figura, F.chute,
   chefão e laboratórios (F.lab no código-fonte ou .lab no html). Imprime em Markdown a tabela por módulo e a tabela da dívida
   técnica (temas abaixo de 15 exercícios, sem figura ou sem F.chute), com os totais. Uso: node tools/conta-temas.js
   Foi assim que o "Estado final" do PROGRESSO.md foi preenchido (β 4.6/4.7). Atualizar o PROGRESSO depois de mexer nos temas. */
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
const RAIZ = path.resolve(__dirname, '..');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.addInitScript(() => document.addEventListener('readystatechange', () => { if (document.readyState === 'interactive') localStorage.setItem('jarvis:acesso', JSON.stringify({ chaves: ['adm'] })); }, { once: true }));
  await p.goto('file://' + path.join(RAIZ, 'index.html') + '#/home'); await p.waitForTimeout(600);
  const r = await p.evaluate(async () => { const F = window.F, out = [];
    for (const m of window.CATALOGO) { const area = window.AREAS.find((a) => a.id === m.area), mat = (area && area.materia) || 'fisica';
      const mod = { area: m.area || 'fisica', mat, id: m.id, nome: m.nome, total: m.temas.length, escritos: 0, temas: [] };
      for (const t of m.temas) { if (!t[3]) continue; mod.escritos++; const chave = mat === 'fisica' ? t[0] : mat + '/' + t[0], arq = mat === 'fisica' ? `temas/${t[0]}.js` : `temas/${mat}/${t[0]}.js`;
        if (!(F.temas && F.temas[chave])) await new Promise((ok) => { const s = document.createElement('script'); s.src = arq; s.onload = ok; s.onerror = ok; document.body.appendChild(s); });
        if (!F.temas[chave]) continue; F.area = m.area;
        const doc = new DOMParser().parseFromString('<div>' + F.temas[chave].html(F) + '</div>', 'text/html'), ex = [...doc.querySelectorAll('.ex')];
        mod.temas.push({ cod: t[0], arq, ex: ex.length, exFig: ex.filter((e) => e.querySelector('svg, canvas, img, .fig, figure')).length, chute: !!doc.querySelector('.chute'), chefao: !!doc.querySelector('.chefao'), labHtml: doc.querySelectorAll('.lab').length }); }
      out.push(mod); }
    return out; });
  await b.close();
  const NOMES = { fisica: 'Física', lab: 'Experimental', exp: 'Experimentos', matcalc: 'Cálculo (Matemática)' };
  let mod = '| Aba | Módulo | Temas | Exercícios (mín–máx) | Total | Sem figura | Com `F.chute` | Com chefão | Laboratórios |\n|---|---|---|---|---|---|---|---|---|\n';
  let tab = '| Tema | Exercícios | Faltam para 15 | Sem figura | `F.chute` |\n|---|---|---|---|---|\n'; const T = { temas: 0, ex: 0, faltam: 0, semFig: 0, semChute: 0 };
  for (const m of r) { if (!m.escritos) continue;
    m.temas.forEach((t) => { t.labs = Math.max((fs.readFileSync(path.join(RAIZ, t.arq), 'utf8').match(/F\.lab\(/g) || []).length, t.labHtml); });
    const ex = m.temas.map((t) => t.ex);
    mod += `| ${NOMES[m.area] || m.area} | ${m.id} ${m.nome} | ${m.escritos}/${m.total} | ${Math.min(...ex)}–${Math.max(...ex)} | ${ex.reduce((a, b) => a + b, 0)} | ${m.temas.reduce((a, t) => a + t.ex - t.exFig, 0)} | ${m.temas.filter((t) => t.chute).length} | ${m.temas.filter((t) => t.chefao).length} | ${m.temas.reduce((a, t) => a + t.labs, 0)} |\n`;
    if (m.area === 'exp' || m.id === 'S' || m.id === 'K5') continue; /* experimentos não têm exercícios por decisão; simulados têm formato próprio */
    m.temas.forEach((t) => { const falta = Math.max(0, 15 - t.ex), sf = t.ex - t.exFig; if (!falta && !sf && t.chute) return;
      T.temas++; T.ex += t.ex; T.faltam += falta; T.semFig += sf; T.semChute += t.chute ? 0 : 1;
      tab += `| ${m.mat === 'fisica' ? '' : m.mat + '/'}${t.cod} | ${t.ex} | ${falta || '—'} | ${sf || '—'} | ${t.chute ? 'tem' : 'falta'} |\n`; }); }
  tab += `| **Total (${T.temas} temas)** | **${T.ex}** | **${T.faltam}** | **${T.semFig}** | **${T.semChute} sem** |\n`;
  console.log('## Por módulo\n\n' + mod + '\n## Dívida técnica, tema por tema\n\n' + tab);
})();
