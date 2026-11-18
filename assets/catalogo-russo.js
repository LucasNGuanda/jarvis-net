/* Russo (β 3.8): áreas (abas do topo) e módulos. Mesmo formato do assets/catalogo.js; rota de um tema: #/russo/<COD>.
   Vocabulário solto NÃO entra no site (o Lucas usa Anki todo dia). O botão de exportar palavras para o Anki está só previsto (campo extra da aba Leitura). */
window.AREAS.push(
  { id:"rus", materia:"russo", nome:"Gramática", inicio:"russo", titulo:"Gramática russa", anim:"matrioska", icone:`<svg viewBox="0 0 32 32" aria-hidden="true"><text x="16" y="23" text-anchor="middle" style="font:700 19px var(--f-text);fill:currentColor">Я</text><path d="M6 27h20" style="stroke:var(--mR)" stroke-width="2" stroke-linecap="round"/></svg>` },
  { id:"rusleit", materia:"russo", nome:"Leitura e tradução", inicio:"russo-leitura", titulo:"Leitura e tradução", anim:"letraYa", icone:`<svg viewBox="0 0 32 32" fill="none" stroke-linejoin="round" aria-hidden="true"><path d="M16 9C12 6 7 6 4 7v18c3-1 8-1 12 2 4-3 9-3 12-2V7c-3-1-8-1-12 2z" style="stroke:currentColor" stroke-width="1.8"/><path d="M16 9v18" style="stroke:currentColor" stroke-width="1.4"/><path d="M7 12h5M7 16h6M20 12h5M19 16h6" style="stroke:var(--mR)" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    extra:`<div class="cartao" style="margin-top:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap"><div style="flex:1;min-width:220px"><b>Exportar palavras para o Anki</b><div style="color:var(--ink2);font-size:14px">O vocabulário fica no Anki. Este botão vai exportar as palavras dos textos para um baralho.</div></div><button class="bt" type="button" disabled aria-disabled="true" title="Em breve">Exportar para o Anki</button><span class="breve-tag" style="margin-left:0">em breve</span></div>` },
);
window.CATALOGO.push(
  { id:"RG", area:"rus", letra:"RG", cor:"--mR", nome:"Gramática russa", desc:"Do alfabeto aos casos, aspectos verbais e orações.", temas:[
    ["RG01","Alfabeto cirílico e pronúncia",[],true],
    ["RG02","Ortografia e acento tônico",["RG01"],true],
    ["RG03","Substantivos: gênero e número",["RG01","RG02"],true],
    ["RG04","Nominativo e acusativo",["RG03"],true],
    ["RG05","Genitivo",["RG04"],true],
    ["RG06","Dativo",["RG05"],true],
    ["RG07","Instrumental",["RG06"],true],
    ["RG08","Preposicional",["RG07"],true],
    ["RG09","Adjetivos: concordância e declinação",["RG08"],true],
    ["RG10","Pronomes",["RG09"],true],
    ["RG11","Verbos no presente",["RG04"],true],
    ["RG12","Verbos no passado e no futuro",["RG11"],true],
    ["RG13","Aspecto verbal: perfectivo × imperfectivo",[],true],
    ["RG14","Verbos de movimento",["RG13"],true],
    ["RG15","Preposições e regência",["RG08"],true],
    ["RG16","Numerais e expressões de tempo",["RG05"],true],
    ["RG17","Imperativo e condicional",[]],
    ["RG18","Orações subordinadas e conjunções",[]],
  ] },
  { id:"RL", area:"rusleit", letra:"RL", cor:"--mC", nome:"Leitura", desc:"Textos A1–B1, vocabulário de exatas e enunciados de olimpíada.", temas:[
    ["RL01","Textos nível A1",[]],
    ["RL02","Textos nível A2",[]],
    ["RL03","Textos nível B1",[]],
    ["RL04","Vocabulário de matemática em russo",[]],
    ["RL05","Vocabulário de física em russo",[]],
    ["RL06","Como ler um enunciado de olimpíada",[]],
    ["RL07","Enunciados da Fiztech comentados",[]],
    ["RL08","Falsos amigos e armadilhas de tradução",[]],
  ] },
);
