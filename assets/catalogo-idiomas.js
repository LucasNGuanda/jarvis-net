/* Alemão e sânscrito (β 4.1): mesma estrutura do russo (abas Gramática e Leitura e tradução). Módulos "em breve", sem temas:
   o Lucas manda os temas depois. Rota de um tema: #/alemao/<COD>, #/sanscrito/<COD>. */
(function () {
const DEVA = "'Noto Sans Devanagari','Nirmala UI','Mangal','FreeSans',sans-serif";
window.AREAS.push(
  { id:"deu", materia:"alemao", nome:"Gramática", inicio:"alemao", titulo:"Gramática alemã", anim:"letraEszett", icone:`<svg viewBox="0 0 32 32" aria-hidden="true"><text x="16" y="23" text-anchor="middle" style="font:700 19px var(--f-text);fill:currentColor">ß</text><path d="M6 27h20" style="stroke:var(--mDE)" stroke-width="2" stroke-linecap="round"/></svg>` },
  { id:"deuleit", materia:"alemao", nome:"Leitura e tradução", inicio:"alemao-leitura", titulo:"Leitura e tradução", anim:"portao", icone:`<svg viewBox="0 0 32 32" fill="none" stroke-linejoin="round" aria-hidden="true"><path d="M16 9C12 6 7 6 4 7v18c3-1 8-1 12 2 4-3 9-3 12-2V7c-3-1-8-1-12 2z" style="stroke:currentColor" stroke-width="1.8"/><path d="M16 9v18" style="stroke:currentColor" stroke-width="1.4"/><path d="M7 12h5M7 16h6M20 12h5M19 16h6" style="stroke:var(--mDE)" stroke-width="1.6" stroke-linecap="round"/></svg>` },
  { id:"san", materia:"sanscrito", nome:"Gramática", inicio:"sanscrito", titulo:"Gramática do sânscrito", anim:"letraSam", icone:`<svg viewBox="0 0 32 32" aria-hidden="true"><text x="16" y="22" text-anchor="middle" style="font:700 16px ${DEVA};fill:currentColor">सं</text><path d="M6 27h20" style="stroke:var(--mSA)" stroke-width="2" stroke-linecap="round"/></svg>` },
  { id:"sanleit", materia:"sanscrito", nome:"Leitura e tradução", inicio:"sanscrito-leitura", titulo:"Leitura e tradução", anim:"om", icone:`<svg viewBox="0 0 32 32" fill="none" stroke-linejoin="round" aria-hidden="true"><path d="M16 9C12 6 7 6 4 7v18c3-1 8-1 12 2 4-3 9-3 12-2V7c-3-1-8-1-12 2z" style="stroke:currentColor" stroke-width="1.8"/><path d="M16 9v18" style="stroke:currentColor" stroke-width="1.4"/><path d="M7 12h5M7 16h6M20 12h5M19 16h6" style="stroke:var(--mSA)" stroke-width="1.6" stroke-linecap="round"/></svg>` },
);
window.CATALOGO.push(
  { id:"DEG", area:"deu", letra:"DG", cor:"--mDE", nome:"Gramática alemã", desc:"Em breve.", temas:[] },
  { id:"DEL", area:"deuleit", letra:"DL", cor:"--mC", nome:"Leitura", desc:"Em breve.", temas:[] },
  { id:"SAG", area:"san", letra:"SG", cor:"--mSA", nome:"Gramática do sânscrito", desc:"Em breve. (Para ler a Bhagavad Gita.)", temas:[] },
  { id:"SAL", area:"sanleit", letra:"SL", cor:"--mO", nome:"Leitura", desc:"Em breve.", temas:[] },
);
})();
