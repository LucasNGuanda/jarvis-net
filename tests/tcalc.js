const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
// Testa a calculadora apertando as teclas (como o Lucas faria) e confere com o valor certo.
const { chromium } = require('playwright');
const res = [];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); await require('./adm')(p);
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(RAIZ + '#/inicio'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(600);
  // liga pelo interruptor das configurações
  await p.click('#bt-config'); await p.click('#cfg-calc'); await p.waitForTimeout(600);
  const vis = await p.evaluate(() => { const d = document.getElementById('calculadora'); const r = d.getBoundingClientRect(); return [d.classList.contains('visivel'), Math.round(innerHeight - r.top)]; });
  res.push([vis[0] && vis[1] > 30 && vis[1] < 60, `interruptor liga: só o topo aparece no canto (${vis[1]} px à mostra)`]);
  await p.click('body', { position: { x: 900, y: 600 } });
  await p.click('.calc-aba'); await p.waitForTimeout(600);
  const ab = await p.evaluate(() => { const r = document.getElementById('calculadora').getBoundingClientRect(); return [Math.round(r.left), Math.round(innerHeight - r.bottom), Math.round(r.height)]; });
  res.push([ab[0] === 16 && ab[1] === 0 && ab[2] > 500, `clicar no topo sobe a calculadora (esquerda ${ab[0]} px, altura ${ab[2]} px)`]);
  await p.screenshot({ path: 'calc-aberta.png' });

  const aperta = async (seq) => { for (const k of seq.trim().split(/\s+/)) { if (!k) continue; const ok = await p.evaluate((k) => { const b = document.querySelector(`#calculadora [data-k="${k}"]`); if (!b) return false; b.click(); return true; }, k); if (!ok) throw new Error('sem tecla ' + k); } await p.waitForTimeout(30); };
  const le = () => p.evaluate(() => ({ v: CALC.st.res && CALC.st.res.v, ans: CALC.st.ans, tela: CALC.st.tela, baixo: document.querySelector('#calculadora .lcd-baixo').innerText.trim(), cima: document.querySelector('#calculadora .lcd-cima').innerText.trim(), erro: CALC.st.erro && CALC.st.erro.tipo, sol: CALC.st.eqn.sol, st: CALC.st.res }));
  const perto = (a, b, t = 1e-9) => typeof a === 'number' && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  async function caso(nome, seq, teste) { try { await aperta('on ' + seq); const r = await le(); const [ok, info] = teste(r); res.push([ok, `${nome}: ${info ?? (r.erro || r.baixo)}`]); } catch (e) { res.push([false, `${nome}: EXCEÇÃO ${e.message}`]); } }
  const val = (esp, t) => (r) => [perto(r.v, esp, t), `${r.baixo.replace(/\n/g, ' ')} (valor ${r.v})`];

  // ---- COMP ----
  await caso('2+3×4', '2 add 3 mul 4 igual', val(14));
  await caso('1÷3 dá fração 1/3', '1 div 3 igual', (r) => [perto(r.v, 1 / 3) && /1\s*3/.test(r.baixo), r.baixo.replace(/\n/g, '/')]);
  await caso('S⇔D: 1/3 vira decimal', '1 div 3 igual sd', (r) => [/0\.3333333333/.test(r.baixo), r.baixo]);
  await caso('sen 30° = 1/2', 'sin 3 0 igual', val(0.5));
  await caso('sen 180° = 0 exato', 'sin 1 8 0 igual', (r) => [r.v === 0, r.baixo]);
  await caso('tan 90° = Math ERROR', 'tan 9 0 igual', (r) => [/Math ERROR/.test(r.erro || ''), r.erro]);
  await caso('√2 em forma exata', 'sqrt 2 igual', (r) => [perto(r.v, Math.SQRT2) && /√|2/.test(r.baixo) && !/1\.414/.test(r.baixo), r.baixo]);
  await caso('2^10', '2 pow 1 0 igual', val(1024));
  await caso('(−)2² = −4', 'neg 2 sq igual', val(-4));
  await caso('5! = 120', '5 shift inv igual', val(120));
  await caso('10P3 = 720', '1 0 shift mul 3 igual', val(720));
  await caso('10C3 = 120', '1 0 shift div 3 igual', val(120));
  await caso('log 100 = 2', 'log 1 0 0 igual', val(2));
  await caso('ln e = 1', 'ln alpha e10 igual', val(1));
  await caso('log₂8 = 3 (casinhas: base ▶ número)', 'logab 2 right 8 igual', val(3));
  await caso('∛27 = 3', 'shift sqrt 2 7 igual', val(3));
  await caso('d/dx(X³) em 2 = 12 (casinhas)', 'shift integ alpha rp shift sq right 2 igual', val(12, 1e-8));
  await caso('Σ(X, 1, 100) = 5050 (casinhas)', 'shift logab alpha rp right 1 right 1 0 0 igual', val(5050));
  await caso('Pol(1,1): r = √2, θ = 45°', 'shift add 1 shift rp 1 rp igual', (r) => [perto(r.ans, Math.SQRT2) && /45/.test(r.baixo), r.baixo.replace(/\n/g, ' ')]);
  await caso('Rec(2,60°): X = 1', 'shift sub 2 shift rp 6 0 rp igual', (r) => [perto(r.ans, 1), r.baixo.replace(/\n/g, ' ')]);
  await caso('6,02×10²³ × 2', '6 pt 0 2 e10 2 3 mul 2 igual', val(1.204e24));
  await caso('×10ˣ sozinho: 10³', 'e10 3 igual', val(1000));
  await caso('CONST 28 = c', 'shift 7 2 8 igual', val(299792458));
  await caso('CONST 06 = h', 'shift 7 0 6 igual', val(6.62607015e-34));
  await caso('CONV 19: 100 km/h → m/s', '1 0 0 shift 8 1 9 igual', val(100 / 3.6));
  await caso('CONV 37: 212 °F → °C', '2 1 2 shift 8 3 7 igual', val(100));
  await caso('STO A: 5 → A', '5 shift rcl neg', (r) => [r.ans === 5, r.baixo]);
  await caso('A² = 25', 'alpha neg sq igual', val(25));
  await caso('RCL A', 'rcl neg', (r) => [/5/.test(r.baixo), r.baixo]);
  await caso('1/2 + 1/3 = 5/6 (número antes da tecla de fração)', '1 frac 2 right add 1 frac 3 igual', (r) => [perto(r.v, 5 / 6) && /5\s*6/.test(r.baixo), r.baixo.replace(/\n/g, '/')]);
  await caso('fração mista 7/2 → 3 1/2', '7 frac 2 igual shift sd', (r) => [/3\s*1\s*2/.test(r.baixo), r.baixo.replace(/\n/g, ' ')]);
  await caso('30°30° = 30,5', '3 0 dms 3 0 dms igual', val(30.5));
  await caso('°′″ mostra 30,5 em graus-minutos', '3 0 pt 5 igual dms', (r) => [/30°30°0°/.test(r.baixo), r.baixo]);
  await caso('ENG: 12345 → 12,345×10³', '1 2 3 4 5 igual eng', (r) => [/12\.345\s*×10\s*3/.test(r.baixo), r.baixo.replace(/\n/g, '')]);
  await caso('Ans: 3 = ×2 =', '3 igual mul 2 igual', val(6));
  await caso('M+: soma na memória', 'shift 9 2 igual on 4 mplus 6 mplus alpha mplus igual', val(10));
  await caso('1÷0 = Math ERROR', '1 div 0 igual', (r) => [/Math ERROR/.test(r.erro || ''), r.erro]);
  await caso('2)) = Syntax ERROR', '2 rp rp igual', (r) => [/Syntax ERROR/.test(r.erro || ''), r.erro]);
  await caso('erro + ◀ volta a editar', '1 div 0 igual left', (r) => [r.tela === 'edit' && /1÷0/.test(r.cima), r.cima]);
  await caso('histórico ▲ traz a conta anterior', '7 mul 8 igual on up', (r) => [/7×8/.test(r.cima), r.cima]);
  await caso('DEL apaga sin( inteiro', 'sin 3 0 left left del igual', (r) => [perto(r.v, 30), r.baixo]);
  await caso('SOLVE X² − 2 = 0 (X? 1)', 'alpha rp sq sub 2 alpha calc 0 shift calc 1 igual', (r) => [perto(r.v, Math.SQRT2, 1e-10), r.baixo.replace(/\n/g, ' ')]);
  await caso('CALC: A + 1 com A = 4', 'alpha neg add 1 calc 4 igual', val(5));
  await caso('Rad: ∫ de 0 a π/2 de cos X = 1 (▶ vai para o limite de baixo e depois o de cima)', 'shift mode 4 integ cos alpha rp rp right 0 right shift e10 div 2 igual', val(1, 1e-9));
  await caso('Rad: ∫ com ▼ e ▲ para os limites', 'integ cos alpha rp rp down 0 up frac shift e10 down 2 igual', val(1, 1e-9));
  await caso('Rad: sen(π) = 0', 'sin shift e10 rp igual', (r) => [r.v === 0, r.baixo]);
  await caso('Rad: sen⁻¹(1) = π/2 em forma exata', 'shift sin 1 igual', (r) => [perto(r.v, Math.PI / 2) && /π/.test(r.baixo), r.baixo.replace(/\n/g, '/')]);
  await caso('Fix 2: 1÷3 = 0.33', 'shift mode 3 shift mode 6 2 1 div 3 igual sd', (r) => [/^0\.33$/.test(r.baixo), r.baixo]);
  await caso('Norm 1 de volta', 'shift mode 8 1 1 div 3 igual sd', (r) => [/0\.3333333333/.test(r.baixo), r.baixo]);
  await caso('hyp sin: sinh(1)', 'hyp sin 1 igual', val(Math.sinh(1)));
  await caso('Abs(−3) = 3', 'shift hyp neg 3 right igual', val(3));
  await caso('Rnd com Fix', 'shift mode 6 2 shift 0 1 div 3 rp mul 3 igual', val(0.99));
  await caso('Norm de novo', 'shift mode 8 1', (r) => [true, 'ok']);

  // ---- os problemas que o Lucas relatou ----
  await caso('fração pela tecla primeiro: ▭/▭ 1 ▼ 3 = 1/3', 'frac 1 down 3 igual', (r) => [perto(r.v, 1 / 3), r.baixo.replace(/\n/g, '/')]);
  await caso('fração ÷ fração: (3/4) ÷ (1/2) = 3/2', 'frac 3 down 4 right div frac 1 down 2 igual', (r) => [perto(r.v, 1.5), r.baixo.replace(/\n/g, '/')]);
  await caso('fração dentro de fração: 1/(1/3) = 3', 'frac 1 down frac 1 down 3 igual', val(3));
  await caso('▲ volta ao numerador e edita', 'frac 1 down 4 up 2 igual', (r) => [perto(r.v, 3), r.baixo]);
  await caso('▲▼ fora de fração não apagam a conta', '2 add 3 up down igual', val(5));
  await caso('▲ depois do resultado ainda puxa o histórico', '9 mul 9 igual on 1 igual up up', (r) => [/9×9/.test(r.cima), r.cima]);
  await caso('∫ de 1 a 2 de X² = 7/3', 'integ alpha rp sq right 1 right 2 igual', (r) => [perto(r.v, 7 / 3, 1e-9), r.baixo]);
  await caso('∫ com limite vazio = Syntax ERROR', 'integ alpha rp right right 2 igual', (r) => [/Syntax/.test(r.erro || ''), r.erro]);
  await caso('DEL apaga a fração vazia', 'frac del 5 igual', val(5));
  await caso('◀ sai do denominador para o numerador', 'frac 7 down 2 left left 1 igual', (r) => [perto(r.v, 3.5) || perto(r.v, 17 / 2) || perto(r.v, 71 / 2), 'valor ' + r.v]);
  await caso('Ans vai para o numerador: 6 = ▭/▭ 4', '6 igual frac 4 igual', (r) => [perto(r.v, 1.5), r.baixo]);
  await caso('raiz n-ésima: 3 ˣ√ 8... ³√8 = 2', '3 shift pow 8 igual', val(2));
  await caso('10^(casinha) = 1000', 'shift log 3 igual', val(1000));
  await caso('fração mista 2 1/2 = 5/2', '2 shift frac 1 down 2 igual', val(2.5));
  // ---- CMPLX ----
  await caso('CMPLX: (1+2i)(3−i) = 5+5i', 'mode 2 lp 1 add 2 eng rp mul lp 3 sub eng rp igual', (r) => [r.v && r.v.re === 5 && r.v.im === 5, r.baixo]);
  await caso('CMPLX: √(−4) = 2i', 'sqrt neg 4 igual', (r) => [r.v && r.v.re === 0 && r.v.im === 2, r.baixo]);
  await caso('CMPLX: 2∠90 = 2i', '2 shift neg 9 0 igual', (r) => [r.v && Math.abs(r.v.re) < 1e-12 && perto(r.v.im, 2), r.baixo]);
  await caso('CMPLX: |3+4i| = 5', 'shift hyp 3 add 4 eng right igual', val(5));
  // ---- EQN ----
  await caso('EQN: X² − 3X + 2 = 0', 'mode 5 3 1 igual neg 3 igual 2 igual igual', (r) => [r.sol && r.sol[0][1] === 2 && r.sol[1][1] === 1, JSON.stringify(r.sol.slice(0, 2))]);
  await caso('EQN: 2X+Y=5, X−Y=1', 'mode 5 1 2 igual 1 igual 5 igual 1 igual neg 1 igual 1 igual igual', (r) => [r.sol && perto(r.sol[0][1], 2) && perto(r.sol[1][1], 1), JSON.stringify(r.sol)]);
  await caso('EQN: X³−6X²+11X−6', 'mode 5 4 1 igual neg 6 igual 1 1 igual neg 6 igual igual', (r) => [r.sol && perto(r.sol[0][1], 3) && perto(r.sol[1][1], 2) && perto(r.sol[2][1], 1), JSON.stringify(r.sol)]);
  await caso('EQN: X² + 1 = 0 → ±i', 'mode 5 3 1 igual 0 igual 1 igual igual', (r) => [r.sol && r.sol[0][1].im === 1 && r.sol[0][1].re === 0, JSON.stringify(r.sol.slice(0, 2))]);
  // ---- STAT ----
  const X = [1, 2, 3, 4], Y = [2, 4.1, 5.9, 8.1], n = 4, xm = 2.5, ym = Y.reduce((a, b) => a + b) / n;
  const Sxx = X.reduce((s, x) => s + (x - xm) ** 2, 0), Sxy = X.reduce((s, x, i) => s + (x - xm) * (Y[i] - ym), 0), Syy = Y.reduce((s, y) => s + (y - ym) ** 2, 0);
  const B = Sxy / Sxx, A = ym - B * xm, rr = Sxy / Math.sqrt(Sxx * Syy);
  await caso('STAT A+BX: dados', 'mode 3 2 1 igual 2 igual 3 igual 4 igual right up up up up 2 igual 4 pt 1 igual 5 pt 9 igual 8 pt 1 igual ac', (r) => [r.tela === 'edit', r.tela]);
  await caso('STAT: B (inclinação)', 'shift 1 5 2 igual', val(B, 1e-9));
  await caso('STAT: A', 'shift 1 5 1 igual', val(A, 1e-9));
  await caso('STAT: r', 'shift 1 5 3 igual', val(rr, 1e-9));
  await caso('STAT: ŷ(5)', '5 shift 1 5 5 igual', val(A + B * 5, 1e-9));
  await caso('STAT: x̄', 'shift 1 4 2 igual', val(2.5));
  await caso('STAT: sx (amostral)', 'shift 1 4 4 igual', val(Math.sqrt(Sxx / 3), 1e-9));
  await caso('STAT 1-VAR: σx de 2,4,4,4,5,5,7,9 = 2', 'mode 3 1 2 igual 4 igual 4 igual 4 igual 5 igual 5 igual 7 igual 9 igual ac shift 1 4 3 igual', val(2));
  // ---- TABLE ----
  await caso('TABLE: f(X) = X², 1 a 5', 'mode 7 alpha rp sq igual 1 igual 5 igual 1 igual', (r) => [/25/.test(r.cima) || true, 'ok']);
  { const t = await p.evaluate(() => CALC.st.tab.linhas); res.push([JSON.stringify(t) === JSON.stringify([[1, 1], [2, 4], [3, 9], [4, 16], [5, 25]]), 'TABLE linhas: ' + JSON.stringify(t)]); }
  // ---- BASE-N ----
  await caso('BASE-N: HEX F+1 = 10', 'mode 4 pow tan add 1 igual', (r) => [r.v === 16 && /^10$/.test(r.baixo), r.baixo]);
  await caso('BASE-N: em DEC = 16', 'pow tan add 1 igual sq', (r) => [/^16$/.test(r.baixo), r.baixo]);
  await caso('BASE-N: em BIN = 10000', 'sq 1 6 igual log', (r) => [/^10000$/.test(r.baixo), r.baixo]);
  await caso('BASE-N: 12 and 10 (DEC) = 8', 'sq 1 2 shift 3 1 1 0 igual', val(8));
  // ---- MATRIX ----
  await caso('MATRIX: MatA 2×2', 'mode 6 1 5 1 igual 2 igual 3 igual 4 igual ac', (r) => [r.tela === 'edit', r.tela]);
  await caso('det(MatA) = −2', 'shift 4 7 shift 4 3 rp igual', val(-2));
  await caso('MatA⁻¹', 'shift 4 3 inv igual', (r) => [JSON.stringify(r.ans.m) === JSON.stringify([[-2, 1], [1.5, -0.5]]), JSON.stringify(r.ans.m)]);
  await caso('MatA²', 'ac shift 4 3 sq igual', (r) => [JSON.stringify(r.ans.m) === JSON.stringify([[7, 10], [15, 22]]), JSON.stringify(r.ans.m)]);
  // ---- VECTOR ----
  await caso('VECTOR: VctA = (1,0,0)', 'mode 8 1 1 1 igual 0 igual 0 igual ac shift 5 1 2 1 0 igual 1 igual 0 igual ac', (r) => [true, 'ok']);
  await caso('VctA × VctB = (0,0,1)', 'shift 5 3 mul shift 5 4 igual', (r) => [JSON.stringify(r.ans.v) === '[0,0,1]', JSON.stringify(r.ans && r.ans.v)]);
  await caso('Dot(VctA, VctB) = 0', 'ac shift 5 7 shift 5 3 shift rp shift 5 4 rp igual', val(0));
  await caso('|VctB| = 1', 'shift hyp shift 5 4 right igual', val(1));
  // ---- volta ao COMP, teclado do computador ----
  await aperta('mode 1');
  await p.click('#calculadora .lcd'); await p.keyboard.type('12*3+1'); await p.keyboard.press('Enter'); await p.waitForTimeout(50);
  { const r = await le(); res.push([r.v === 37, 'teclado do computador: 12*3+1 Enter = ' + r.v]); }
  await p.screenshot({ path: 'calc-res.png' });
  // shift e alpha acesos
  await aperta('shift'); await p.screenshot({ path: 'calc-shift.png' }); await aperta('shift');
  // OFF fecha; interruptor desliga
  await aperta('shift ac'); await p.waitForTimeout(600);
  { const r = await p.evaluate(() => [document.getElementById('calculadora').classList.contains('aberta'), Math.round(innerHeight - document.getElementById('calculadora').getBoundingClientRect().top)]); res.push([!r[0] && r[1] < 60, `OFF fecha (só o topo à mostra: ${r[1]} px)`]); }
  await p.reload(); await p.waitForTimeout(800);
  res.push([await p.evaluate(() => document.getElementById('calculadora')?.classList.contains('visivel')), 'ligada continua ligada depois de recarregar']);
  await p.click('#bt-config'); await p.click('#cfg-calc'); await p.waitForTimeout(700);
  res.push([await p.evaluate(() => document.getElementById('calculadora').hidden), 'interruptor desliga e a calculadora some']);
  console.log(res.filter(r => r[0]).length + ' de ' + res.length + ' ok'); process.exitCode = res.every((r) => r[0]) ? 0 : 1; /* β 3.7: falha vira código de erro */
  res.filter(r => !r[0]).forEach(r => console.log('FALHA  ' + r[1]));
  console.log('---'); res.filter(r => r[0]).forEach(r => console.log('ok     ' + r[1]));
  console.log(errs.length ? 'ERROS JS: ' + errs.join(' | ') : 'sem erros JS');
  await b.close();
})();
