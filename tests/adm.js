/* β 4.1: o site começa todo trancado (acesso por código). Os testes antigos rodam como ADM:
   em cada carregamento, se não houver acesso salvo, grava { chaves: ["adm"] }. (Um teste que limpa o localStorage volta a ter ADM
   no próximo carregamento.) tests/tacesso.js testa o visitante.
   Cuidado: mexer no localStorage no instante em que o documento nasce (direto no addInitScript) faz o Chromium perder, às vezes,
   o que o teste gravou logo antes de recarregar (visto em file://). Por isso a gravação espera o documento ficar "interactive",
   que ainda vem antes dos scripts do site (todos com defer). */
module.exports = (p) => p.addInitScript(() => {
  const poe = () => { try { if (!localStorage.getItem('jarvis:acesso')) localStorage.setItem('jarvis:acesso', JSON.stringify({ chaves: ['adm'] })); } catch (e) {} };
  document.addEventListener('readystatechange', () => { if (document.readyState === 'interactive') poe(); }, { once: true });
});
