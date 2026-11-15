const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
const { chromium } = require('playwright');
const res = [];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 950 } }); await require('./adm')(p);
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(RAIZ + '#/inicio'); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); CALC2.ligaSalvo(true); CALC2.abre(true); });
  await p.waitForTimeout(500);
  const K = (ks) => p.evaluate((ks) => { ks.forEach(k => CALC2.aperta(k)); return { res: (document.querySelector('.c2-res') || {}).textContent || '', corpo: (document.querySelector('.c2-corpo') || {}).textContent || '', tela: CALC2.u.tela, ans: CALC2.s2.ans, v: CALC2.u.res && CALC2.u.res.v }; }, ks);
  const ok = (c, m) => res.push([c, m]);
  const perto = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const novo = async () => K(['ac', 'home', 'ok', 'ac']);
  let r;
  await novo(); r = await K(['frac', '1', 'down', '3', 'right', 'add', 'sqrt', '2', 'exe']);
  ok(/1\+3/.test(r.res) && perto(r.v, 1 / 3 + Math.SQRT2), '1/3 + √2 = (1+3√2)/3 exato → ' + r.res.slice(0, 20));
  r = await K(['up', 'shift', 'exe']); ok(/1,747546896/.test(r.res), 'SHIFT EXE (≈) dá decimal com vírgula: 1,747546896 → ' + r.res);
  await novo(); r = await K(['frac', '1', 'down', '2', 'right', 'div', 'frac', '1', 'down', '4', 'right', 'exe']); ok(r.v === 2, 'fração ÷ fração: (1/2)÷(1/4) = 2 → ' + r.v);
  await novo(); r = await K(['sin', '3', '0', 'rp', 'exe']); ok(r.v === 0.5 && /12/.test(r.res), 'sen(30) em graus = 1/2 → ' + r.res.slice(0, 12));
  await novo(); r = await K(['logab', '2', 'right', '8', 'right', 'exe']); ok(r.v === 3, 'log₂(8) = 3 → ' + r.v);
  await novo(); r = await K(['shift', 'sq', '1', '0', '0', 'rp', 'exe']); ok(r.v === 2, 'SHIFT x² = log: log(100) = 2 → ' + r.v);
  await novo(); r = await K(['2', 'pow', '1', '0', 'right', 'exe']); ok(r.v === 1024, '2^10 = 1024 → ' + r.v);
  await novo(); r = await K(['4', 'shift', 'pow', 'exe']); ok(r.v === 0.25, 'SHIFT ■^□ = ⁻¹: 4⁻¹ = 0,25 → ' + r.v);
  await novo(); r = await K(['shift', 'sqrt', '3', 'right', '2', '7', 'right', 'exe']); ok(perto(r.v, 3), 'SHIFT √ = ⁿ√: ³√27 = 3 → ' + r.v);
  await novo(); r = await K(['2', 'e10', '3', 'right', 'exe']); ok(r.v === 2000, '2×10³ = 2000 → ' + r.v);
  await novo(); r = await K(['1', 'div', '2', 'e10', '3', 'right', 'exe']); ok(perto(r.v, 0.0005), '1÷2×10³ = 0,0005 (×10 cola no número) → ' + r.v);
  await novo(); r = await K(['2', 'pt', '5', 'mul', '2', 'exe']); ok(r.v === 5, 'vírgula decimal: 2,5 × 2 = 5 → ' + r.v);
  await novo(); r = await K(['5', 'exe', 'var', 'ok', 'down', 'ok', 'ac', 'shift', '4', 'mul', '2', 'exe']); ok(r.v === 10, 'VARIABLE: guarda Ans em A, SHIFT 4 (A) × 2 = 10 → ' + r.v);
  await novo(); r = await K(['func', 'ok', 'x', 'sq', 'add', '1', 'exe', 'func', 'down', 'down', 'ok', '3', 'rp', 'exe']); ok(r.v === 10, 'FUNCTION: f(x) = x² + 1, f(3) = 10 → ' + r.v);
  await novo(); r = await K(['1', '7', 'shift', 'div', '5', 'exe']); ok(/Q=3/.test(r.res) && /R=2/.test(r.res), '17 ÷R 5: Q = 3, R = 2 → ' + r.res);
  await novo(); r = await K(['cat', 'down', 'down', 'ok', 'ok', '1', '2', 'shift', 'rp', '1', '8', 'rp', 'exe']); ok(r.v === 6, 'CATALOG MDC(12;18) = 6 → ' + r.v);
  await novo(); r = await K(['cat', 'down', 'down', 'ok', 'down', 'ok', '4', 'shift', 'rp', '6', 'rp', 'exe']); ok(r.v === 12, 'CATALOG MMC(4;6) = 12 → ' + r.v);
  await novo(); r = await K(['0', 'pt', '7', '5', 'exe', 'format', 'down', 'down', 'ok']); ok(/34/.test(r.res.replace(/\s/g, '')), 'FORMAT 0,75 → fração imprópria 3/4 → ' + r.res.slice(0, 10));
  await novo(); r = await K(['7', 'div', '4', 'exe', 'format', 'down', 'down', 'down', 'ok']); ok(/134/.test(r.res.replace(/\s/g, '')), 'FORMAT 7÷4 → fração mista 1 3/4 → ' + r.res.slice(0, 12));
  await novo(); r = await K(['2', 'pt', '5', 'exe', 'format', '6']); ok(/2°30′0″/.test(r.res), 'FORMAT 2,5 → sexagesimal 2°30′0″ → ' + r.res);
  await novo(); r = await K(['3', '6', '0', 'exe', 'format', '7']); ok(/23×32×5/.test(r.res.replace(/\s/g, '')), 'FORMAT 360 → primos 2³×3²×5 → ' + r.res.slice(0, 16));
  await novo(); r = await K(['1', '2', '3', '4', '5', 'exe', 'format', '5']); ok(/12,345/.test(r.res) && /10/.test(r.res), 'FORMAT 12345 → engenharia 12,345×10³ → ' + r.res);
  await novo(); r = await K(['frac', '1', '2', 'down', '1', '8', 'right', 'exe', 'shift', 'ans']); ok(/F=2/.test(r.res) && /69/.test(r.res.replace(/\s/g, '')), 'Simp 12/18 → 6/9 (F=2) → ' + r.res);
  r = await K(['shift', 'ans']); ok(/F=3/.test(r.res) && /23/.test(r.res.replace(/\s/g, '')), 'Simp de novo → 2/3 (F=3) → ' + r.res);
  await novo(); r = await K(['2', 'add', '2', 'shift', 'lp', '4', 'exe']); ok(/Verdadeiro/.test(r.res), '2 + 2 = 4 → Verdadeiro → ' + r.res);
  await novo(); r = await K(['1', 'div', '0', 'exe']); ok(r.tela === 'erro' && /matemático/.test(r.corpo), '1 ÷ 0 → ERRO matemático → ' + r.corpo.slice(0, 30));
  r = await K(['ac']); ok(r.tela === 'calc', 'AC sai do erro');
  await novo(); r = await K(['cat', 'down', 'down', 'down', 'ok', 'down', 'down', 'down', 'ok', '1', 'shift', 'rp', '1', 'rp', 'exe']); ok(/r=1,414213562/.test(r.res) && /θ=45/.test(r.res), 'Pol(1;1): r = 1,414…, θ = 45 → ' + r.res);
  await novo(); r = await K(['2', 'exe', '3', 'exe', 'up']); ok(r.v === 2, 'histórico: ▲ depois do resultado volta para a conta anterior → ' + r.v);
  await novo(); r = await K(['config', 'down', 'ok', 'down', 'ok', 'ac', 'sin', 'shift', '7', 'div', '6', 'rp', 'exe']); ok(perto(r.v, 0.5), 'CONFIG radiano: sen(π÷6) = 0,5 → ' + r.v);
  await K(['config', 'down', 'ok', 'ok']);
  await novo(); r = await K(['config', 'ok', 'down', 'ok', 'ac', 'frac', '1', 'down', '3', 'right', 'exe']); ok(/0,3333333333/.test(r.res), 'CONFIG Matem./Decimal: 1/3 sai 0,3333333333 → ' + r.res);
  await K(['config', 'ok', 'ok']);
  // Estatística
  r = await K(['home', 'right', 'ok', 'ok', '1', 'exe', '2', 'exe', '3', 'exe', '4', 'exe', '5', 'exe', 'tools', 'ok']);
  const L = await p.evaluate(() => CALC2.u.est.linhas);
  const g = (k) => (L.find(x => x[0] === k) || [])[1];
  ok(g('x̄') === 3 && perto(g('σx'), Math.SQRT2) && perto(g('sx'), Math.sqrt(2.5)) && g('Q₁') === 1.5 && g('Med') === 3 && g('Q₃') === 4.5 && g('n') === 5, 'Estatística 1-Var de 1..5: x̄ = 3, σx = √2, sx = √2,5, Q₁ = 1,5, Med = 3, Q₃ = 4,5 → ' + JSON.stringify(L.slice(0, 8)));
  r = await K(['back', 'tools', 'down', 'ok', 'tools', 'down', 'down', 'ok', 'down', 'ok', '1', 'exe', '2', 'exe', '3', 'exe', 'up', 'up', 'up', 'right', '2', 'exe', '4', 'exe', '6', 'exe', 'tools', 'down', 'ok']);
  const L2 = await p.evaluate(() => CALC2.u.est.linhas);
  const g2 = (k) => (L2.find(x => x[0] === k) || [])[1];
  ok(perto(g2('a'), 0) && perto(g2('b'), 2) && perto(g2('r'), 1), 'Estatística y=a+bx com (1,2), (2,4), (3,6): a = 0, b = 2, r = 1 → ' + JSON.stringify(L2));
  // Tabela
  r = await K(['home', '3', 'ac', 'x', 'sq', 'exe', 'ac', '2', 'x', 'exe', '1', 'exe', '5', 'exe', '1', 'exe']);
  const rows = await p.evaluate(() => CALC2.u.tab.rows);
  ok(rows.length === 5 && rows.map(x => x[1]).join() === '1,4,9,16,25' && rows.map(x => x[2]).join() === '2,4,6,8,10', 'Tabela f(x) = x² e g(x) = 2x de 1 a 5 → ' + JSON.stringify(rows));
  // Caixa Matemática
  await K(['home', '4', 'ok', '2', 'exe', '1', '0', '0', 'exe']);
  const cx = await p.evaluate(() => { const t = CALC2.u.cx.res.tab; return { soma: t.reduce((s, x) => s + x[1], 0), min: t[0][0], max: t[t.length - 1][0] }; });
  ok(cx.soma === 100 && cx.min === 2 && cx.max === 12, 'Caixa: 2 dados, 100 lançamentos, somas de 2 a 12 → ' + JSON.stringify(cx));
  const det = await p.evaluate(() => { CALC2._lancaCaixa(() => 0); return CALC2.u.cx.res.tab[0]; }); ok(det[0] === 2 && det[1] === 100, 'Caixa com sorteio fixo em 0: todos dão soma 2 → ' + JSON.stringify(det));
  // OFF / ON
  r = await K(['shift', 'ac']); const off = await p.evaluate(() => document.querySelector('.c2-lcd').classList.contains('off')); ok(off, 'SHIFT AC desliga (OFF)');
  r = await K(['on']); ok(r.tela === 'home', 'ON liga de novo na HOME');
  // só uma por vez
  const ex = await p.evaluate(async () => { document.getElementById('cfg-calc').click(); await new Promise(r => setTimeout(r, 600)); return [JSON.parse(localStorage.getItem('fisica:calculadora')), JSON.parse(localStorage.getItem('fisica:calculadora2')), document.getElementById('calculadora2').classList.contains('visivel'), document.getElementById('calculadora').classList.contains('visivel')]; });
  ok(ex[0] === true && ex[1] === false && !ex[2] && ex[3], 'ligar a calculadora 1 desliga a 2 → ' + ex);
  const ex2 = await p.evaluate(async () => { document.getElementById('cfg-calc2').click(); await new Promise(r => setTimeout(r, 600)); return [JSON.parse(localStorage.getItem('fisica:calculadora')), JSON.parse(localStorage.getItem('fisica:calculadora2')), document.getElementById('calculadora2').classList.contains('visivel'), document.getElementById('calculadora').classList.contains('visivel')]; });
  ok(ex2[0] === false && ex2[1] === true && ex2[2] && !ex2[3], 'ligar a 2 desliga a 1 → ' + ex2);
  await p.reload(); await p.waitForTimeout(1200);
  const rel = await p.evaluate(() => [!!document.getElementById('calculadora2') && document.getElementById('calculadora2').classList.contains('visivel'), !document.getElementById('calculadora') || !document.getElementById('calculadora').classList.contains('visivel')]);
  ok(rel[0] && rel[1], 'recarregando a página, continua só a 2 ligada → ' + rel);
  console.log(res.filter(r => r[0]).length + ' de ' + res.length + ' ok'); process.exitCode = res.every((r) => r[0]) ? 0 : 1; /* β 3.7: falha vira código de erro */
  res.forEach(r => console.log((r[0] ? 'ok     ' : 'FALHA  ') + r[1]));
  console.log(errs.length ? 'ERROS: ' + errs.join(' | ') : 'sem erros JS');
  await b.close();
})();
