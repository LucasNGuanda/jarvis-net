/* Química (β 3.7): áreas (abas do topo) e módulos. Mesmo formato do assets/catalogo.js: acrescentar módulo ou tema é só editar aqui.
   Os ids dos módulos levam um Q na frente (QA … QJ) para não colidir com os da Física (A, C, F, T…); a letra mostrada é A … J.
   Por enquanto os módulos estão vazios (o Lucas manda a lista de temas depois). Fórmulas químicas com \ce{} (mhchem já carregado). */
window.AREAS.push(
  { id:"qui", materia:"quimica", nome:"Química", inicio:"quimica", titulo:"Química", anim:"benzeno", icone:`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 4h8M13.5 4v8L6 25.5A2 2 0 0 0 7.8 28.5h16.4a2 2 0 0 0 1.8-3L18.5 12V4"/><path d="M9.5 20h13" style="stroke:var(--mN)"/><circle cx="14" cy="23.5" r="1.3" style="fill:var(--mN);stroke:none"/><circle cx="18.5" cy="24.5" r="1" style="fill:var(--mN);stroke:none"/></svg>` },
  { id:"quiexp", materia:"quimica", nome:"Experimentos", inicio:"quimica-experimentos", titulo:"Experimentos de química", anim:"bequer", icone:`<svg viewBox="0 0 32 32" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 6h18M9 6v19a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V6" style="stroke:currentColor" stroke-width="1.8"/><path d="M9.5 16h13v9a2.5 2.5 0 0 1-2.5 2.5h-8A2.5 2.5 0 0 1 9.5 25z" style="fill:color-mix(in srgb,var(--mN) 30%,transparent)"/><circle cx="14" cy="21" r="1.6" style="stroke:var(--mN)" stroke-width="1.3"/><circle cx="18.5" cy="18.5" r="1.1" style="stroke:var(--mN)" stroke-width="1.2"/><circle cx="16.5" cy="12" r="1" style="stroke:var(--mN)" stroke-width="1.1"/></svg>` },
);
window.CATALOGO.push(
  { id:"QA", area:"qui", letra:"A", cor:"--mF", nome:"Introdução à química", desc:"Matéria, substâncias, misturas e separação.", temas:[] },
  { id:"QB", area:"qui", letra:"B", cor:"--mA", nome:"Atomística", desc:"Modelos atômicos, distribuição eletrônica e tabela periódica.", temas:[] },
  { id:"QC", area:"qui", letra:"C", cor:"--mC", nome:"Ligações químicas", desc:"Iônica, covalente, metálica, geometria e forças intermoleculares.", temas:[] },
  { id:"QD", area:"qui", letra:"D", cor:"--mO", nome:"Reações e estequiometria", desc:"Balanceamento, mol, rendimento e reagente limitante.", temas:[] },
  { id:"QE", area:"qui", letra:"E", cor:"--mS", nome:"Físico-química I", desc:"Soluções, propriedades coligativas e termoquímica.", temas:[] },
  { id:"QF", area:"qui", letra:"F", cor:"--mT", nome:"Físico-química II", desc:"Cinética, equilíbrio químico e iônico.", temas:[] },
  { id:"QG", area:"qui", letra:"G", cor:"--mK1", nome:"Eletroquímica", desc:"Pilhas, potenciais e eletrólise.", temas:[] },
  { id:"QH", area:"qui", letra:"H", cor:"--mU", nome:"Química orgânica", desc:"Funções, isomeria e reações orgânicas.", temas:[] },
  { id:"QI", area:"qui", letra:"I", cor:"--mX", nome:"Bioquímica e ambiental", desc:"Biomoléculas, polímeros e química do ambiente.", temas:[] },
  { id:"QJ", area:"qui", letra:"J", cor:"--mM", nome:"Química analítica", desc:"Titulação, análise qualitativa e quantitativa.", temas:[] },
);
