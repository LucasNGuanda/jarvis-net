const RAIZ = 'file://' + require('path').resolve(__dirname, '..', 'index.html'); /* site na pasta acima de tests/ */
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  const temas = process.argv.slice(2); const sus = /\+ ?[-−]|[-−] ?[-−]|(^|[^0-9,.])1x|\^\{?1\}?(?![0-9])|\{,\}0+(?![0-9])|\( ?\+|= ?\+/;
  for (const t of temas) {
    await p.goto(RAIZ + '#/'+t); await p.waitForTimeout(1000);
    const n = await p.$$eval('#exemplos .escolha .bt, .exemplo .escolha .bt', x=>x.length).catch(()=>0);
    const achados = new Set();
    for (let c=0;c<n;c++){ await p.evaluate(i=>document.querySelectorAll('.exemplo .escolha .bt')[i].click(), c);
      for(let k=0;k<6;k++){ await p.evaluate(()=>{const e=document.querySelector('.exemplo'); e.querySelector('[data-a=par]').click(); e.querySelector('[data-a=tudo]').click();});
        const fontes = await p.$$eval('.exemplo .katex-mathml annotation, .exemplo .enun', es=>es.map(e=>e.textContent));
        for (const f of fontes) { const m = f.match(sus); if (m) achados.add(f.slice(Math.max(0,m.index-30), m.index+30).replace(/\s+/g,' ')); } } }
    console.log(t, n, 'casos;', achados.size ? [...achados].slice(0,8).join('  ||  ') : 'ok');
  }
  await b.close(); })();
