/* Descrição da página por rota (o site é uma página só, com rotas por hash).
   NÃO mexe no <title> (ele leva a versão do Jarvis e é trocado a cada entrega) nem no motor.
   Lê o que já está na tela: o <h1> da página aberta. Assim nunca descreve mais do que o visitante vê
   (numa rota trancada, a descrição é a da página "sem acesso", não a do tema).
   Buscadores leem só a página inicial; isto serve para favoritos, histórico e leitores de tela. */
(function () {
  const BASE = "Jarvis: site de estudo em português com teoria passo a passo, laboratórios interativos e exercícios de Física, Química, Matemática e Russo, voltado a olimpíadas científicas e ao ITA. Parte do conteúdo abre com código de acesso.";
  const poe = (sel, v) => { const m = document.querySelector(sel); if (m) m.setAttribute("content", v); };
  const limpa = (s) => (s || "").replace(/\s+/g, " ").trim();
  function atualiza() {
    const h = location.hash || "#/home", raiz = h === "#/home" || h === "#/" || h === "#";
    const h1 = document.querySelector("main.principal h1"), nome = raiz ? "" : limpa(h1 && h1.textContent).slice(0, 90);
    const desc = nome ? `${nome} · Jarvis: teoria passo a passo, laboratórios interativos e exercícios para olimpíadas científicas e ITA.` : BASE;
    poe('meta[name="description"]', desc); poe('meta[property="og:description"]', desc); poe('meta[name="twitter:description"]', desc);
    poe('meta[property="og:title"]', nome ? `${nome} · Jarvis` : "Jarvis · Física, Química, Matemática e Russo para olimpíadas");
  }
  const depois = () => setTimeout(atualiza, 350); /* espera o motor desenhar a página */
  window.addEventListener("hashchange", depois); window.addEventListener("DOMContentLoaded", depois); window.addEventListener("load", depois);
})();
