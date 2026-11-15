// node valida.js : confere tabela-dados.js contra o SIM.ELEM do site
const fs = require('fs'), path = require('path');
global.window = {};
require(path.join(__dirname, 'tabela-dados.js'));
const T = window.TABELA_DADOS, E = T.elementos;
const src = fs.readFileSync('/home/user/site-fisica/assets/sims/quimica/atomistica.js', 'utf8');
const w = {}; new Function('window', 'document', src)(w, {});
const S = w.SIM.ELEM.simb, SIMB = Array.isArray(S) ? S : S.split(' ');
let falhas = 0; const f = (m) => { falhas++; console.log('FALHA', m); };
if (E.length !== 118) f('qtd ' + E.length);
if (SIMB.length !== 118) f('SIM.ELEM ' + SIMB.length);
const campos = ['z','s','massa','conf','en','raio','ei','ae','ox','estado','pf','pe','dens','ano','autor','meia','usos'];
const numer = ['z','massa','en','raio','ei','ae','pf','pe','dens','ano'];
const nul = {}; campos.forEach((c) => (nul[c] = 0));
E.forEach((e, i) => {
  if (e.z !== i + 1) f('z fora de ordem em ' + i);
  if (e.s !== SIMB[i]) f(`símbolo ${e.z}: ${e.s} × ${SIMB[i]}`);
  if (Object.keys(e).join() !== campos.join()) f('campos de ' + e.s + ': ' + Object.keys(e));
  campos.forEach((c) => { if (e[c] === undefined) f(e.s + '.' + c + ' undefined'); if (e[c] === null) nul[c]++;
    if (e[c] !== null && numer.includes(c) && (typeof e[c] !== 'number' || !isFinite(e[c]))) f(e.s + '.' + c + ' não é número');
    if (e[c] !== null && !numer.includes(c) && (typeof e[c] !== 'string' || !e[c].trim())) f(e.s + '.' + c + ' não é texto'); });
  if (e.pf !== null && e.pe !== null && !(e.pf < e.pe)) console.log('pf >= pe:', e.s, e.pf, e.pe);
  const semEst = [43, 61, 83].includes(e.z) || e.z >= 84;
  if (semEst !== (e.meia !== null)) f('meia ' + e.s);
  if ((e.ano === null) !== (e.autor === 'conhecido desde a Antiguidade')) f('ano/autor ' + e.s);
  if (e.usos && e.usos.split(/\s+/).length > 14) console.log('usos longo:', e.s, e.usos.split(/\s+/).length);
  if (/[$<>{}\\]/.test(Object.values(e).filter((v) => typeof v === 'string').join(' '))) f('caractere perigoso em ' + e.s);
  if (e.massa < (i ? E[i - 1].massa : 0)) console.log('massa menor que a do anterior:', e.s, e.massa, E[i - 1].massa);
});
// estado × listas do próprio site (gas/liq em SIM.tabela)
const lista = (n) => JSON.parse(src.match(new RegExp('\\b' + n + ' = (\\[[\\d, ]+\\])'))[1]);
const gas = lista('gas'), liq = lista('liq');
E.forEach((e) => { const t = gas.includes(e.z) ? 'gás' : liq.includes(e.z) ? 'líquido' : 'sólido'; if (e.estado && t !== e.estado) console.log('estado difere do site:', e.s, e.estado, t); });
console.log('null por campo:', JSON.stringify(nul));
console.log('fontes:', T.fontes.length, '| FALHAS (' + falhas + ')');
