/* Matemática (β 3.7): áreas (abas do topo) e módulos. Mesmo formato do assets/catalogo.js: acrescentar módulo ou tema é só editar aqui.
   Temas: ["COD", "Nome", [marcas], pronto]. Por enquanto os módulos estão vazios (o Lucas manda a lista de temas depois).
   O Cálculo 1 e 2 continuam na Física até a mudança combinada (numa branch de teste, com o progresso exportado antes). */
window.AREAS.push(
  { id:"mat", materia:"matematica", nome:"Matemática", inicio:"matematica", titulo:"Matemática", anim:"solido", icone:`<svg viewBox="0 0 32 32" fill="none" stroke-linecap="round" aria-hidden="true"><path d="M5 27V5M5 27h22" style="stroke:var(--ink3)" stroke-width="1.8"/><path d="M6 24C11 24 12 8 17 8s6 12 10 6" style="stroke:var(--mK2)" stroke-width="2.4"/></svg>` },
  { id:"matcalc", materia:"matematica", nome:"Cálculo", inicio:"matematica-calculo", titulo:"Cálculo", anim:"calculo", icone:`<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M6 27h5v-8H6zM11 27h5v-12h-5zM16 27h5v-15h-5z" style="stroke:var(--mK1);fill:color-mix(in srgb,var(--mK1) 25%,transparent)" stroke-width="1.4"/><path d="M5 21C11 13 18 9 27 7" style="stroke:currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
  { id:"olim", materia:"matematica", nome:"Olimpíada e demonstrações", inicio:"olimpiada", titulo:"Olimpíada e demonstrações", anim:"impares", icone:`<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="8" r="3.4" style="fill:var(--mK5)"/><circle cx="8" cy="23" r="3.4" style="fill:var(--mC)"/><circle cx="24" cy="23" r="3.4" style="fill:var(--mA)"/></svg>` },
);
window.CATALOGO.push(
  /* aba Matemática */
  { id:"MB", area:"mat", letra:"MB", cor:"--mF", nome:"Matemática Básica", desc:"Frações, potências, equações e funções: a base de tudo.", temas:[] },
  { id:"AR", area:"mat", letra:"AR", cor:"--mO", nome:"Aritmética", desc:"Divisibilidade, MDC, MMC, primos e congruências.", temas:[] },
  { id:"GE", area:"mat", letra:"GE", cor:"--mU", nome:"Geometria", desc:"Plana, espacial e analítica.", temas:[] },
  { id:"AL", area:"mat", letra:"AL", cor:"--mC", nome:"Álgebra", desc:"Polinômios, sequências, matrizes, complexos e combinatória.", temas:[] },
  /* aba Cálculo (o Cálculo 1 e 2 ainda estão na Física) */
  { id:"MK3", area:"matcalc", letra:"3", cor:"--mK3", nome:"Cálculo 3", desc:"Em breve.", temas:[] },
  { id:"MK4", area:"matcalc", letra:"4", cor:"--mK4", nome:"Cálculo 4", desc:"Em breve.", temas:[] },
  /* aba Olimpíada e demonstrações */
  { id:"DM", area:"olim", letra:"DM", cor:"--mA", nome:"Técnicas de demonstração", desc:"Indução, absurdo, contrapositiva, casa dos pombos e invariantes.", temas:[] },
  { id:"TNO", area:"olim", letra:"TNO", cor:"--mM", nome:"Teoria dos números olímpica", desc:"Congruências, ordem, resíduos e equações diofantinas.", temas:[] },
  { id:"DES", area:"olim", letra:"DES", cor:"--mS", nome:"Desigualdades", desc:"Médias, Cauchy–Schwarz, rearranjo e Jensen.", temas:[] },
  { id:"CBO", area:"olim", letra:"CBO", cor:"--mX", nome:"Combinatória olímpica", desc:"Contagem, bijeções, grafos e jogos.", temas:[] },
  { id:"GEO", area:"olim", letra:"GEO", cor:"--mN", nome:"Geometria olímpica", desc:"Ângulos, potência de ponto, homotetia e inversão.", temas:[] },
  { id:"FUN", area:"olim", letra:"FUN", cor:"--mK1", nome:"Equações funcionais", desc:"Substituições, injetividade e Cauchy.", temas:[] },
  { id:"PRI", area:"olim", letra:"PRI", cor:"--mK5", nome:"Projeto números primos", desc:"O projeto pessoal do Lucas: fórmulas e padrões dos primos.", temas:[] },
);
