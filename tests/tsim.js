/* Laboratórios (simulações, window.SIM). Uso: node tests/tsim.js
   1. Nomes SIM.x não podem se repetir entre arquivos: todos os arquivos de assets/sims/ são carregados juntos no index.html, e o último carregado
      sobrescreve o primeiro sem aviso. (Aconteceu na β 4.9, 5.1 e 5.2: SIM.curvas, SIM.decaimento e SIM.dipolo da Química apagaram os laboratórios
      de mesmo nome da Física. Corrigido na β 5.2 com o prefixo q nos da Química.)
   2. Todo laboratório (SIM.x = (el, …) => …) tem, na linha de cima, a etiqueta pedida pelo Lucas:
          nome: "título por extenso" · matéria: Física | Matemática | Química · tema: código
      e a matéria da etiqueta bate com a pasta do arquivo. As etiquetas são postas por `python3 tools/etiqueta-labs.py --aplica`. */
const fs = require('fs'), path = require('path'), raiz = path.resolve(__dirname, '..');
const arquivos = []; const anda = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = path.join(d, e.name); if (e.isDirectory()) anda(p); else if (e.name.endsWith('.js')) arquivos.push(p); });
anda(path.join(raiz, 'assets'));
let f = 0; const ok = (c, m) => { if (!c) f++; console.log((c ? 'ok ' : 'FALHA ') + m); };
const onde = {};
for (const a of arquivos) { const s = fs.readFileSync(a, 'utf8'), re = /(?<![\w.])SIM\.([A-Za-z_]\w*)\s*=(?!=)/g; let m; while ((m = re.exec(s))) (onde[m[1]] = onde[m[1]] || new Set()).add(path.relative(raiz, a)); }
const dup = Object.entries(onde).filter(([, v]) => v.size > 1);
ok(!dup.length, Object.keys(onde).length + ' nomes de simulação, nenhum repetido entre arquivos' + (dup.length ? ' → ' + dup.map(([k, v]) => 'SIM.' + k + ' em ' + [...v].join(' e ')).join('; ') : ''));
const sem = [], troca = [], porMat = {}; let labs = 0;
for (const a of arquivos.filter((x) => x.includes(path.join('assets', 'sims')))) { const rel = path.relative(raiz, a), mat = rel.includes('quimica') ? 'Química' : rel.includes('matematica') ? 'Matemática' : 'Física', l = fs.readFileSync(a, 'utf8').split('\n');
  l.forEach((ln, i) => { const m = ln.match(/^\s*SIM\.([A-Za-z_]\w*) = \(el\b/); if (!m) return; labs++; const t = (l[i - 1] || '').match(/^\s*\/\* nome: "([^"]+)" · matéria: (Física|Matemática|Química) · tema: (.+) \*\/$/); if (!t) sem.push(rel + ': SIM.' + m[1]); else { porMat[t[2]] = (porMat[t[2]] || 0) + 1; if (t[2] !== mat) troca.push(rel + ': SIM.' + m[1] + ' diz ' + t[2]); } }); }
ok(!sem.length, labs + ' laboratórios, todos com a etiqueta nome · matéria · tema (' + Object.entries(porMat).map(([k, v]) => k + ' ' + v).join('; ') + ')' + (sem.length ? ' → sem etiqueta: ' + sem.slice(0, 8).join('; ') : ''));
ok(!troca.length, 'a matéria de cada etiqueta bate com a pasta do arquivo' + (troca.length ? ' → ' + troca.slice(0, 8).join('; ') : ''));
console.log('FALHAS (' + f + ')' + (f ? '' : ':')); process.exit(f ? 1 : 0);
