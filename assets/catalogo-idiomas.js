/* Alemão e sânscrito (β 4.1; temas cadastrados na β 4.2): mesma estrutura do russo (abas Gramática e Leitura e tradução).
   Tudo "em breve", sem conteúdo. Rota de um tema: #/alemao/<COD>, #/sanscrito/<COD>. Acesso: só o código próprio de cada um ou o ADM
   (ver assets/acesso-config.js). Módulos: DG, DL (alemão); SG, SL (sânscrito). */
(function () {
const DEVA = "'Noto Sans Devanagari','Nirmala UI','Mangal','FreeSans',sans-serif";
window.AREAS.push(
  { id:"deu", materia:"alemao", nome:"Gramática", inicio:"alemao", titulo:"Gramática alemã", anim:"letraEszett", icone:`<svg viewBox="0 0 32 32" aria-hidden="true"><text x="16" y="23" text-anchor="middle" style="font:700 19px var(--f-text);fill:currentColor">ß</text><path d="M6 27h20" style="stroke:var(--mDE)" stroke-width="2" stroke-linecap="round"/></svg>` },
  { id:"deuleit", materia:"alemao", nome:"Leitura e tradução", inicio:"alemao-leitura", titulo:"Leitura e tradução", anim:"portao", icone:`<svg viewBox="0 0 32 32" fill="none" stroke-linejoin="round" aria-hidden="true"><path d="M16 9C12 6 7 6 4 7v18c3-1 8-1 12 2 4-3 9-3 12-2V7c-3-1-8-1-12 2z" style="stroke:currentColor" stroke-width="1.8"/><path d="M16 9v18" style="stroke:currentColor" stroke-width="1.4"/><path d="M7 12h5M7 16h6M20 12h5M19 16h6" style="stroke:var(--mDE)" stroke-width="1.6" stroke-linecap="round"/></svg>` },
  { id:"san", materia:"sanscrito", nome:"Gramática", inicio:"sanscrito", titulo:"Gramática do sânscrito", anim:"letraSam", icone:`<svg viewBox="0 0 32 32" aria-hidden="true"><text x="16" y="22" text-anchor="middle" style="font:700 16px ${DEVA};fill:currentColor">सं</text><path d="M6 27h20" style="stroke:var(--mSA)" stroke-width="2" stroke-linecap="round"/></svg>` },
  { id:"sanleit", materia:"sanscrito", nome:"Leitura e tradução", inicio:"sanscrito-leitura", titulo:"Leitura e tradução", anim:"om", icone:`<svg viewBox="0 0 32 32" fill="none" stroke-linejoin="round" aria-hidden="true"><path d="M16 9C12 6 7 6 4 7v18c3-1 8-1 12 2 4-3 9-3 12-2V7c-3-1-8-1-12 2z" style="stroke:currentColor" stroke-width="1.8"/><path d="M16 9v18" style="stroke:currentColor" stroke-width="1.4"/><path d="M7 12h5M7 16h6M20 12h5M19 16h6" style="stroke:var(--mSA)" stroke-width="1.6" stroke-linecap="round"/></svg>` },
);
window.CATALOGO.push(
  { id:"DG", area:"deu", letra:"DG", cor:"--mDE", nome:"Gramática alemã", desc:"Do alfabeto aos casos, à declinação dos adjetivos e à posição do verbo.", temas:[
    ["DG01","Alfabeto, pronúncia e ortografia (umlauts e ß)",[]],
    ["DG02","Substantivos: gênero, plural e a letra maiúscula",[]],
    ["DG03","Artigos definidos e indefinidos",[]],
    ["DG04","Nominativo e acusativo",[]],
    ["DG05","Dativo",[]],
    ["DG06","Genitivo",[]],
    ["DG07","Adjetivos: declinação forte, fraca e mista",[]],
    ["DG08","Pronomes",[]],
    ["DG09","Presente e verbos irregulares",[]],
    ["DG10","Verbos separáveis e inseparáveis",[]],
    ["DG11","Perfekt e Präteritum",[]],
    ["DG12","Futuro e Konjunktiv II",[]],
    ["DG13","Verbos modais",[]],
    ["DG14","Preposições com acusativo, dativo e as de dois casos",[]],
    ["DG15","Ordem das palavras e a posição do verbo",[]],
    ["DG16","Orações subordinadas e conectores",[]],
    ["DG17","Voz passiva",[]],
    ["DG18","Numerais, horas e datas",[]],
  ] },
  { id:"DL", area:"deuleit", letra:"DL", cor:"--mC", nome:"Leitura", desc:"Textos A1–B1, vocabulário de exatas, compostos e textos científicos.", temas:[
    ["DL01","Textos nível A1",[]],
    ["DL02","Textos nível A2",[]],
    ["DL03","Textos nível B1",[]],
    ["DL04","Vocabulário de física em alemão",[]],
    ["DL05","Vocabulário de matemática em alemão",[]],
    ["DL06","Palavras compostas: como desmontar",[]],
    ["DL07","Falsos amigos",[]],
    ["DL08","Ler um texto científico",[]],
  ] },
  { id:"SG", area:"san", letra:"SG", cor:"--mSA", nome:"Gramática sânscrita", desc:"Do devanágari ao sandhi, aos oito casos, aos verbos e à métrica do śloka.", temas:[
    ["SG01","Devanágari: escrita e pronúncia",[]],
    ["SG02","Sandhi vocálico",[]],
    ["SG03","Sandhi consonantal e visarga",[]],
    ["SG04","Os oito casos (vibhakti)",[]],
    ["SG05","Declinação dos temas em -a (masculino e neutro)",[]],
    ["SG06","Declinação dos temas em -ā e -ī (feminino)",[]],
    ["SG07","Outros temas nominais",[]],
    ["SG08","Pronomes",[]],
    ["SG09","Verbos: presente e as dez classes",[]],
    ["SG10","Passado e futuro",[]],
    ["SG11","Imperativo e optativo",[]],
    ["SG12","Particípios",[]],
    ["SG13","Compostos (samāsa): tatpuruṣa, bahuvrīhi, dvandva",[]],
    ["SG14","Numerais e indeclináveis",[]],
    ["SG15","Métrica: o śloka",[]],
  ] },
  { id:"SL", area:"sanleit", letra:"SL", cor:"--mO", nome:"Leitura", desc:"Objetivo: ler a Bhagavad Gita no original.", temas:[
    ["SL01","Frases simples",[]],
    ["SL02","Subhāṣitas: versos de sabedoria",[]],
    ["SL03","Bhagavad Gita: capítulo 1, versos escolhidos",[]],
    ["SL04","Bhagavad Gita: capítulo 2",[]],
    ["SL05","Vocabulário filosófico",[]],
    ["SL06","Como usar um dicionário sânscrito",[]],
    ["SL07","Comparar traduções diferentes do mesmo verso",[]],
  ] },
);
})();
