/* Nomes de simulação (SIM.x) não podem se repetir entre arquivos: todos os arquivos de assets/sims/ são carregados juntos no index.html,
   e o último carregado sobrescreve o primeiro sem aviso. (Aconteceu na β 4.9, 5.1 e 5.2: SIM.curvas, SIM.decaimento e SIM.dipolo da Química
   apagaram os laboratórios de mesmo nome da Física. Corrigido na β 5.2 com o prefixo q nos da Química.) Uso: node tests/tsim.js */
const fs = require('fs'), path = require('path'), raiz = path.resolve(__dirname, '..');
const arquivos = []; const anda = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = path.join(d, e.name); if (e.isDirectory()) anda(p); else if (e.name.endsWith('.js')) arquivos.push(p); });
anda(path.join(raiz, 'assets'));
const onde = {};
for (const f of arquivos) { const s = fs.readFileSync(f, 'utf8'), re = /(?<![\w.])SIM\.([A-Za-z_]\w*)\s*=(?!=)/g; let m; while ((m = re.exec(s))) (onde[m[1]] = onde[m[1]] || new Set()).add(path.relative(raiz, f)); }
const dup = Object.entries(onde).filter(([, v]) => v.size > 1);
dup.forEach(([k, v]) => console.log('FALHA SIM.' + k + ' definido em ' + [...v].join(' e ')));
if (!dup.length) console.log('ok ' + Object.keys(onde).length + ' nomes de simulação, nenhum repetido entre arquivos');
console.log('FALHAS (' + dup.length + ')' + (dup.length ? '' : ':')); process.exit(dup.length ? 1 : 0);
