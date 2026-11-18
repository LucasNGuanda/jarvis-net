/* C07 · Lei de Ohm e Resistores
   Todas as contas dos exercícios e do chefão foram conferidas em Python (ver PROGRESSO.md). */
F.registrar("C07", {
  retoma: ["C06", "C04"],
  html(F) {
    const R = String.raw;
    const E12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
    const comercialAcima = (r) => { for (let d = 1; d < 1e7; d *= 10) for (const v of E12) if (v * d >= r - 1e-9) return v * d; };

    /* ---------- figuras ---------- */
    const figDrude = D.svg(560, 170, `
      <rect x="20" y="20" width="520" height="110" rx="10" class="preen" style="opacity:.55"/>
      ${[...Array(24)].map((_, k) => `<circle cx="${50 + (k % 12) * 42}" cy="${45 + Math.floor(k / 12) * 55}" r="7" style="fill:var(--ink3)"/>`).join("")}
      <polyline points="60,95 95,70 120,108 160,80 175,112 215,66 250,100 280,72 320,104 352,78 380,108 420,70 455,96 500,84" style="fill:none;stroke:#5aa0ff;stroke-width:2"/>
      <circle cx="500" cy="84" r="5" style="fill:#5aa0ff"/>
      ${D.seta(470, 152, 90, 152, "var(--mod)", 2.4)}${D.txt(280, 166, "campo elétrico E →  força no elétron ←  (deriva lenta para a esquerda)", "tx2")}
      ${D.txt(30, 14, "íons da rede", "tx2", "start")}`, "modelo de Drude");
    const figFio = D.svg(560, 170, `${D.cilindro(110, 80, 340, 34)}
      ${D.seta(140, 80, 420, 80, "var(--ink)", 2)}${D.txt(280, 72, "J, E", "txm")}
      <path class="ln2" d="M110 128 v10 H450 v-10"/>${D.txt(280, 158, "L", "txm")}
      ${D.txt(95, 84, "A", "txm", "end")}${D.txt(110, 30, "V₁", "tx")}${D.txt(450, 30, "V₂", "tx")}`, "fio cilíndrico");
    const figCone = D.svg(560, 200, `
      <path class="preen" d="M80 70 L480 40 L480 160 L80 130 Z"/><ellipse class="preen" cx="80" cy="100" rx="10" ry="30"/><ellipse class="preen" cx="480" cy="100" rx="20" ry="60"/>
      <rect x="290" y="${100 - 52}" width="14" height="104" style="fill:color-mix(in srgb,var(--mod) 45%,transparent);stroke:var(--mod)"/>
      ${D.txt(297, 40, "dx", "txm")}${D.txt(318, 104, "r(x)", "txm", "start")}
      <path class="ln2" d="M80 172 v8 H480 v-8"/>${D.txt(280, 196, "L", "txm")}
      ${D.txt(64, 104, "a", "txm", "end")}${D.txt(510, 104, "b", "txm", "start")}`, "cone truncado");
    const figRadial = D.svg(300, 260, `<circle cx="150" cy="130" r="110" class="preen" style="opacity:.6"/><circle cx="150" cy="130" r="72" style="fill:none;stroke:var(--mod);stroke-width:12;opacity:.45"/><circle cx="150" cy="130" r="36" style="fill:var(--ink3)"/>
      ${D.seta(150, 130, 150 + 36 * 0.7, 130 - 36 * 0.7, "var(--ink)", 1.6)}${D.txt(178, 108, "a", "txm")}${D.seta(150, 130, 150 - 110 * 0.8, 130 + 110 * 0.6, "var(--ink)", 1.6)}${D.txt(80, 196, "b", "txm")}
      ${D.txt(222, 76, "dr", "txm", "start")}${D.seta(150 + 36, 130, 150 + 104, 130, "var(--warn)", 2)}${D.txt(245, 140, "i", "txm", "start")}`, "condutor radial");
    const figTerra = D.svg(560, 230, `<line x1="20" y1="70" x2="540" y2="70" class="ln"/>${[...Array(26)].map((_, k) => `<line x1="${24 + 20 * k}" y1="70" x2="${14 + 20 * k}" y2="80" class="ln2"/>`).join("")}
      <path d="M120 70 A40 40 0 0 0 200 70 Z" style="fill:var(--ink3)"/>${D.txt(160, 60, "eletrodo (raio a)", "tx2")}
      <path d="M60 70 A100 100 0 0 0 260 70" style="fill:none;stroke:var(--mod);stroke-dasharray:5 5"/><path d="M10 70 A150 150 0 0 0 310 70" style="fill:none;stroke:var(--mod);stroke-dasharray:5 5;opacity:.6"/>
      ${[0.3, 0.9, 1.6, 2.3, 2.85].map((t) => D.seta(160 + 45 * Math.cos(t), 70 + 45 * Math.sin(t), 160 + 140 * Math.cos(t), 70 + 140 * Math.sin(t), "var(--warn)", 1.6)).join("")}
      <line x1="160" y1="20" x2="160" y2="70" class="ln"/>${D.txt(168, 26, "I", "txm", "start")}
      <g transform="translate(420 0)"><circle cx="20" cy="14" r="7" class="ln"/><path d="M20 21 v22 M20 28 l-12 8 M20 28 l12 8 M20 43 l-14 26 M20 43 l14 26" class="ln"/></g>
      ${D.txt(434, 92, "passo", "tx2")}<path class="ln2" d="M406 84 h28 M434 84 h0"/>`, "eletrodo de aterramento");

    const figCircLED = (E, rot = "R") => D.svg(360, 190, D.fio([[60, 30], [300, 30], [300, 160], [60, 160], [60, 30]]) +
      `<rect x="45" y="70" width="30" height="50" style="fill:var(--card)"/>` + D.comp("bateria", 60, 120, 60, 70, { mais: 1, rot: E, lado: 1 }) +
      `<rect x="150" y="18" width="60" height="24" style="fill:var(--card)"/>` + D.comp("resistor", 150, 30, 210, 30, { rot, lado: 1 }) +
      `<rect x="285" y="70" width="30" height="50" style="fill:var(--card)"/>` + D.comp("led", 300, 70, 300, 120, { rot: "LED", lado: 1, dist: 28 }), "circuito com LED");
    const figR = (rot, setaTxt) => D.svg(320, 90, `${D.fio([[20, 50], [120, 50]])}${D.comp("resistor", 120, 50, 200, 50, { rot, lado: 1 })}${D.fio([[200, 50], [300, 50]])}${D.borne(20, 50)}${D.borne(300, 50)}${D.seta(40, 72, 95, 72, "var(--warn)", 2)}${D.txt(68, 88, setaTxt, "tx2")}`, "resistor");
    const figGraf2 = () => { const x0 = 60, y0 = 210, sx = (m) => x0 + m * 11, sy = (U) => y0 - U * 22;
      let g = ""; for (let U = 0; U <= 8; U += 2) g += `<line class="grade" x1="${x0}" x2="${x0 + 400}" y1="${sy(U)}" y2="${sy(U)}"/>${D.txt(x0 - 8, sy(U) + 4, U, "tx2", "end")}`;
      for (let m = 0; m <= 35; m += 5) g += `<line class="grade" x1="${sx(m)}" x2="${sx(m)}" y1="${y0}" y2="${y0 - 180}"/>${D.txt(sx(m), y0 + 18, m, "tx2")}`;
      g += D.eixos({ x0, y0, w: 410, h: 190 }) + D.txt(x0 + 410, y0 + 34, "i (mA)", "tx2", "end") + D.txt(x0 - 8, y0 - 196, "U (V)", "tx2", "end");
      g += `<line x1="${sx(0)}" y1="${sy(0)}" x2="${sx(26)}" y2="${sy(7.8)}" style="stroke:var(--mod);stroke-width:2.5"/><line x1="${sx(0)}" y1="${sy(0)}" x2="${sx(36)}" y2="${sy(3.6)}" style="stroke:var(--warn);stroke-width:2.5"/>`;
      g += `<circle cx="${sx(20)}" cy="${sy(6)}" r="4" style="fill:var(--mod)"/><circle cx="${sx(30)}" cy="${sy(3)}" r="4" style="fill:var(--warn)"/>${D.txt(sx(26) + 6, sy(7.8), "R₁", "tx", "start")}${D.txt(sx(36) - 4, sy(3.6) - 8, "R₂", "tx", "end")}`;
      return D.svg(500, 240, g, "gráfico de dois resistores"); };

    /* ---------- exemplário (números sorteados) ---------- */
    const exemplario = F.exemplo({
      titulo: "Exemplos passo a passo",
      casos: [
        { nome: "LED com resistor", gerar: (p) => {
          const E = p ? 9 : F.escolha([5, 9, 12]), led = p ? ["vermelho", 2.0] : F.escolha([["vermelho", 2.0], ["verde", 2.2], ["azul", 3.1]]), i = p ? 20 : F.escolha([10, 12, 15, 18, 20]);
          const Ur = E - led[1], Rid = Ur / (i / 1000), Rc = comercialAcima(Rid), ir = Ur / Rc, P = Ur * ir;
          return { enun: R`<p><b>Objetivo:</b> ${i} mA num LED ${led[0]} ($U_\text{LED} = ${F.n(led[1], 1)}$ V) usando uma fonte de ${E} V. Qual resistor comercial (série E12) usar, e quanto ele dissipa?</p>`,
            fig: figCircLED(E + " V"),
            passos: [
              R`<p>O LED "segura" ${F.t(led[1], 1)} V. A tensão que sobra fica no resistor (as tensões em série se somam, como na subida e descida de um morro):</p>$$U_R = E - U_\text{LED} = ${E} - ${F.n(led[1], 1)} = ${F.n(Ur, 1)}\ \text{V}$$`,
              R`<p>A corrente é a mesma no LED e no resistor (estão em série). Lei de Ohm no resistor:</p>$$R = \frac{U_R}{i} = \frac{${F.n(Ur, 1)}}{${F.n(i / 1000, 3)}} \approx ${F.n(Rid, 0)}\ \Omega$$`,
              R`<p>Não existe resistor de ${F.t(Rid, 0)} Ω. Pegamos o <b>comercial logo acima</b> (série E12: 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82 × 10ⁿ), para a corrente ficar um pouco <i>menor</i> e o LED ficar seguro: $R = ${Rc}\ \Omega$.</p>`,
              R`<p>Corrente de verdade e potência no resistor:</p>$$i = \frac{${F.n(Ur, 1)}}{${Rc}} = ${F.n(ir * 1000, 1)}\ \text{mA},\qquad P = U_R\, i = ${F.n(P, 3)}\ \text{W}$$`,
              R`<p><b>Resposta:</b> $R = ${Rc}\ \Omega$, $i \approx ${F.n(ir * 1000, 1)}$ mA e $P \approx ${F.n(P * 1000, 0)}$ mW. ${P < 0.25 ? "Abaixo de 0,25 W: um resistor comum de 1/4 W aguenta." : "<b>Acima de 0,25 W:</b> precisa de um resistor de 1/2 W ou mais!"}</p>`,
            ] }; } },
        { nome: "Esticando o fio", gerar: (p) => {
          const R0 = p ? 10 : F.escolha([5, 8, 10, 12, 20]), k = p ? 2 : F.escolha([1.5, 2, 3, 4]);
          return { enun: R`<p>Um fio de resistência $R_0 = ${R0}\ \Omega$ é esticado até ficar com ${F.t(k, 1)} vezes o comprimento original, sem perder material e sem mudar a resistividade. Qual a nova resistência?</p>`,
            fig: D.svg(520, 120, `${D.cilindro(60, 35, 140, 16)}${D.txt(130, 70, "antes: L, A", "tx2")}${D.cilindro(60, 95, Math.min(420, 140 * k), 16 / Math.sqrt(k))}${D.txt(60 + Math.min(420, 140 * k) / 2, 118, "depois: " + F.t(k, 1) + "L, A'", "tx2")}`, "fio esticado"),
            passos: [
              R`<p>O que <b>não muda</b> é o volume (o material é o mesmo): $V = L A = L' A'$.</p>`,
              R`<p>Com $L' = ${F.n(k, 1)}L$: $\;A' = \dfrac{LA}{L'} = \dfrac{A}{${F.n(k, 1)}}$. O fio fica ${F.t(k, 1)} vezes mais comprido <i>e</i> ${F.t(k, 1)} vezes mais fino.</p>`,
              R`$$R' = \rho\frac{L'}{A'} = \rho\frac{${F.n(k, 1)}L}{A/${F.n(k, 1)}} = ${F.n(k * k, 2)}\,\rho\frac{L}{A} = ${F.n(k * k, 2)}\,R_0$$`,
              R`<p><b>Resposta:</b> $R' = ${F.n(k * k, 2)} \times ${R0} = ${F.n(k * k * R0, 1)}\ \Omega$. Esticar $k$ vezes multiplica a resistência por $k^2$.</p>`,
            ] }; } },
        { nome: "Fio do chuveiro", gerar: (p) => {
          const P = p ? 5500 : F.escolha([4400, 5500, 6600, 7500]), U = p ? 220 : F.escolha([127, 220]), d = p ? 0.6 : F.escolha([0.5, 0.6, 0.7, 0.8]);
          const Rr = (U * U) / P, A = (Math.PI * Math.pow(d * 1e-3, 2)) / 4, L = (Rr * A) / 1.1e-6;
          return { enun: R`<p>Um chuveiro de ${P} W foi feito para ${U} V. A resistência é um fio de nicromo ($\rho = 1{,}1 \times 10^{-6}\ \Omega\cdot\text{m}$, quente) com ${F.t(d, 1)} mm de diâmetro. Qual o comprimento do fio?</p>`,
            fig: D.svg(380, 150, D.fio([[60, 30], [320, 30], [320, 120], [60, 120], [60, 30]]) + `<rect x="45" y="50" width="30" height="50" style="fill:var(--card)"/>${D.comp("bateria", 60, 100, 60, 50, { mais: 1, rot: U + " V", lado: 1 })}<rect x="160" y="18" width="60" height="24" style="fill:var(--card)"/>${D.comp("resistor", 160, 30, 220, 30, { rot: "R (nicromo)", lado: 1 })}`, "chuveiro"),
            passos: [
              R`<p>Na tomada, quem é fixo é a <b>tensão</b>. Então use a forma da potência que tem $U$: $P = U^2/R$.</p>$$R = \frac{U^2}{P} = \frac{${U}^2}{${P}} = ${F.n(Rr, 2)}\ \Omega$$`,
              R`<p>Área do fio: $$A = \frac{\pi d^2}{4} = \frac{\pi\,(${F.n(d, 1)}\times10^{-3})^2}{4} = ${F.sigM(A, 3)}\ \text{m}^2$$</p>`,
              R`<p>2ª lei de Ohm, isolando $L$:</p>$$L = \frac{R\,A}{\rho} = \frac{${F.n(Rr, 2)} \times ${F.sigM(A, 3)}}{1{,}1\times10^{-6}} \approx ${F.n(L, 2)}\ \text{m}$$`,
              R`<p><b>Resposta:</b> uns ${F.t(L, 1)} m de fio, enrolado em espiral. Corrente: $i = P/U = ${F.n(P / U, 1)}$ A.</p>`,
            ] }; } },
        { nome: "Com margem de erro (OBF)", gerar: (p) => {
          const U = p ? 6.0 : F.escolha([4.5, 6.0, 9.0, 12.0]), dU = p ? 0.05 : F.escolha([0.05, 0.1]), i = p ? 24.0 : F.escolha([15.0, 18.0, 24.0, 30.0]), di = p ? 0.3 : F.escolha([0.2, 0.3, 0.5]);
          const Rr = U / (i / 1000), rel = dU / U + di / i, dR = Rr * rel;
          const casas = Math.max(0, -Math.floor(Math.log10(dR))), dRr = +dR.toPrecision(1), Rarr = Math.round(Rr / Math.pow(10, -casas)) * Math.pow(10, -casas);
          return { enun: R`<p>Num experimento, o voltímetro marca $U = (${F.n(U, 2)} \pm ${F.n(dU, 2)})$ V e o amperímetro $i = (${F.n(i, 1)} \pm ${F.n(di, 1)})$ mA. Dê $R$ com a sua incerteza.</p>`,
            fig: D.svg(380, 170, D.fio([[60, 40], [320, 40], [320, 140], [60, 140], [60, 40]]) + `<rect x="45" y="65" width="30" height="50" style="fill:var(--card)"/>${D.comp("bateria", 60, 115, 60, 65, { mais: 1, rot: "E", lado: 1 })}<rect x="300" y="70" width="40" height="40" style="fill:var(--card)"/>${D.comp("medidor", 320, 70, 320, 110, { letra: "A" })}<rect x="160" y="28" width="60" height="24" style="fill:var(--card)"/>${D.comp("resistor", 160, 40, 220, 40, { rot: "R", lado: -1, dist: 20 })}${D.fio([[150, 40], [150, 0 + 8], [230, 8], [230, 40]])}<rect x="176" y="0" width="28" height="16" style="fill:var(--card)"/>${D.comp("medidor", 176, 8, 204, 8, { letra: "V", L: 24 })}`, "voltímetro e amperímetro"),
            passos: [
              R`<p>Valor central: $$R = \frac{U}{i} = \frac{${F.n(U, 2)}}{${F.n(i / 1000, 4)}} = ${F.n(Rr, 1)}\ \Omega$$`,
              R`<p><b>Derivada logarítmica</b> (o método do seu professor): $\ln R = \ln U - \ln i$. Diferenciando e somando os módulos (pior caso):</p>$$\frac{\Delta R}{R} = 1\cdot\frac{\Delta U}{U} + |{-1}|\cdot\frac{\Delta i}{i}$$`,
              R`$$\frac{\Delta R}{R} = \frac{${F.n(dU, 2)}}{${F.n(U, 2)}} + \frac{${F.n(di, 1)}}{${F.n(i, 1)}} = ${F.n(dU / U, 4)} + ${F.n(di / i, 4)} = ${F.n(rel, 4)}$$`,
              R`<p>$\Delta R = ${F.n(rel, 4)} \times ${F.n(Rr, 1)} = ${F.n(dR, 2)}\ \Omega$. A incerteza fica com <b>1 algarismo significativo</b>, e o valor é arredondado na mesma casa.</p>`,
              R`<p><b>Resposta:</b> $R = (${F.n(Rarr, casas)} \pm ${F.n(dRr, casas)})\ \Omega$, incerteza relativa de ${F.t(100 * rel, 1)}%.</p>`,
            ] }; } },
        { nome: "Cone (∫)", gerar: (p) => {
          const a = p ? 1 : F.escolha([0.5, 1, 1.5]), b = p ? 3 : a * F.escolha([2, 3, 4]), L = p ? 10 : F.escolha([5, 10, 20]), rho = p ? 3.0e-5 : F.escolha([1.0e-5, 3.0e-5, 5.0e-5]);
          const Rr = (rho * L * 1e-2) / (Math.PI * a * 1e-3 * b * 1e-3);
          return { enun: R`<p>Um bastão de grafite tem forma de tronco de cone: raios $a = ${F.n(a, 1)}$ mm e $b = ${F.n(b, 1)}$ mm, comprimento $L = ${L}$ cm, $\rho = ${F.sigM(rho, 2)}\ \Omega\cdot\text{m}$. Qual a resistência entre as bases?</p>`, fig: figCone,
            passos: [
              R`<p>A seção muda ao longo do bastão, então $R = \rho L/A$ não vale direto. Corte uma fatia fina de espessura $dx$: ela é um cilindrinho, e as fatias estão <b>em série</b>, então as resistências se somam:</p>$$dR = \rho\,\frac{dx}{\pi r(x)^2} \quad\Rightarrow\quad R = \int_0^L \frac{\rho\,dx}{\pi r(x)^2}$$`,
              R`<p>O raio cresce linearmente: $r(x) = a + \dfrac{b-a}{L}\,x$, então $dr = \dfrac{b-a}{L}dx$. Trocando a variável:</p>$$R = \frac{\rho L}{\pi(b-a)}\int_a^b \frac{dr}{r^2} = \frac{\rho L}{\pi(b-a)}\left(\frac1a - \frac1b\right) = \frac{\rho L}{\pi a b}$$`,
              R`<p>Confere os casos limite: se $b = a$, volta a $\rho L/(\pi a^2)$ ✓. A "área efetiva" é a <b>média geométrica</b> $\pi a b$, não a área média.</p>$$R = \frac{${F.sigM(rho, 2)} \times ${F.n(L / 100, 2)}}{\pi \times ${F.sigM(a * 1e-3, 2)} \times ${F.sigM(b * 1e-3, 2)}} \approx ${F.n(Rr, 2)}\ \Omega$$`,
              R`<p><b>Resposta:</b> $R \approx ${F.n(Rr, 2)}\ \Omega$.</p>`,
            ] }; } },
      ],
    });

    /* ---------- exercícios ---------- */
    const X = F.exercicio;
    const exsFisico = [
      X({ n: 1, enun: R`<p>Um resistor ôhmico dissipa $0{,}50$ W quando atravessado por uma corrente de $50$ mA. Qual é a resistência e qual a tensão entre os terminais?</p>`, fig: figR("R = ?", "i = 50 mA"),
        dicas: [R`<p>Qual das três formas da potência tem só $P$ e $i$?</p>`, R`<p>$P = R\,i^2$. Cuidado: $i$ em ampère.</p>`],
        resp: R`$R = 200\ \Omega$ e $U = 10$ V.`, sol: R`<p>$R = P/i^2 = 0{,}50/(0{,}050)^2 = 200\ \Omega$; $\;U = R\,i = 200 \times 0{,}050 = 10$ V. Confere: $U\,i = 10 \times 0{,}05 = 0{,}5$ W ✓.</p>` }),
      X({ n: 2, enun: R`<p>O gráfico mostra $U \times i$ para dois resistores. (a) Quanto vale $R_1/R_2$? (b) Ligados <b>separadamente</b> na mesma pilha, qual esquenta mais?</p>`, fig: figGraf2(),
        dicas: [R`<p>Leia um ponto bem marcado de cada reta.</p>`, R`<p>Com $U$ igual para os dois, use $P = U^2/R$.</p>`],
        resp: R`(a) $R_1/R_2 = 3$; (b) $R_2$.`, sol: R`<p>$R_1 = 6/0{,}020 = 300\ \Omega$ e $R_2 = 3/0{,}030 = 100\ \Omega$, então $R_1/R_2 = 3$. Na mesma pilha, $U$ é igual: $P = U^2/R$ é maior no <b>menor</b> R, o $R_2$ (3 vezes mais potência).</p>` }),
      X({ n: 3, enun: R`<p>Qual a resistência de $50$ m de fio de cobre de diâmetro $1{,}0$ mm? Use $\rho_\text{Cu} = 1{,}7\times10^{-8}\ \Omega\cdot\text{m}$.</p>`, fig: D.svg(420, 110, `${D.cilindro(40, 50, 330, 20)}<path class="ln2" d="M40 80 v8 H370 v-8"/>${D.txt(205, 104, "L = 50 m", "tx")}${D.txt(395, 55, "d = 1,0 mm", "tx2", "start")}`, "fio de cobre"),
        dicas: [R`<p>Área: $A = \pi d^2/4$, com $d$ em metros.</p>`, R`<p>$A \approx 7{,}85\times10^{-7}$ m².</p>`],
        resp: R`$R \approx 1{,}1\ \Omega$.`, sol: R`<p>$A = \pi(1{,}0\times10^{-3})^2/4 = 7{,}85\times10^{-7}$ m². $R = \rho L/A = 1{,}7\times10^{-8}\times 50/7{,}85\times10^{-7} \approx 1{,}08\ \Omega$. Pouco: por isso fio de cobre "quase não tem resistência".</p>` }),
      X({ n: 4, marcas: ["★"], enun: R`<p>Um fio de $12\ \Omega$ é esticado até o triplo do comprimento, sem perder material. A nova resistência é:</p>`, fig: D.svg(420, 100, `${D.cilindro(40, 30, 110, 16)}${D.txt(95, 64, "12 Ω", "tx2")}${D.cilindro(40, 80, 330, 9.2)}${D.txt(205, 100, "3L", "tx2")}`, "fio esticado"),
        alts: ["$4\\ \\Omega$", "$12\\ \\Omega$", "$36\\ \\Omega$", "$108\\ \\Omega$", "$324\\ \\Omega$"],
        dicas: [R`<p>O que fica constante quando você estica?</p>`, R`<p>$LA$ constante: se $L$ triplica, $A$ cai para um terço.</p>`],
        resp: "D", sol: R`<p>$R' = \rho(3L)/(A/3) = 9R = 108\ \Omega$. <b>C</b> (36 Ω) é quem esqueceu que o fio afina. <b>E</b> (324 Ω) é quem elevou ao cubo.</p>` }),
      X({ n: 5, enun: R`<p>Um chuveiro tem placa "220 V – 5500 W". Por engano é ligado em 127 V. Supondo a resistência constante, qual a potência?</p>`, fig: D.svg(300, 120, `<rect x="110" y="20" width="80" height="34" rx="8" class="ln" style="fill:var(--card)"/>${D.txt(150, 42, "220 V · 5500 W", "tx2")}${[...Array(6)].map((_, k) => `<line x1="${120 + 12 * k}" y1="60" x2="${116 + 12 * k}" y2="100" style="stroke:#5aa0ff;stroke-width:2;stroke-dasharray:4 6"/>`).join("")}`, "chuveiro"),
        dicas: [R`<p>Primeiro descubra $R$ com os dados da placa.</p>`, R`<p>$R = 220^2/5500 = 8{,}8\ \Omega$. Agora $P' = 127^2/R$.</p>`],
        resp: R`$P' \approx 1{,}8\times10^3$ W (uns 1830 W).`, sol: R`<p>$R = U^2/P = 8{,}8\ \Omega$. $P' = 127^2/8{,}8 \approx 1833$ W. Atalho: $P' = P\,(127/220)^2 \approx 0{,}333\,P$. A potência cai com o <b>quadrado</b> da tensão.</p>` }),
      X({ n: 6, enun: R`<p>O filamento de tungstênio de uma lâmpada tem $30\ \Omega$ a $20$ °C e $300\ \Omega$ aceso. Com $\alpha = 4{,}5\times10^{-3}\ ^\circ\text{C}^{-1}$ e o modelo linear, estime a temperatura do filamento aceso.</p>`, fig: D.svg(200, 150, `<circle cx="100" cy="60" r="44" class="ln" style="fill:color-mix(in srgb,var(--warn) 18%,transparent)"/><path d="M80 104 v24 h40 v-24 M84 60 l8 -12 8 12 8 -12 8 12" class="ln"/><path d="M88 104 L84 60 M112 104 L116 60" class="ln2"/>`, "lâmpada"),
        dicas: [R`<p>$R = R_0[1 + \alpha(\theta - 20)]$.</p>`, R`<p>$R/R_0 = 10$.</p>`],
        resp: R`$\theta \approx 2{,}0\times10^3\ ^\circ$C.`, sol: R`<p>$10 = 1 + 4{,}5\times10^{-3}\,\Delta\theta \Rightarrow \Delta\theta = 2000$ °C, $\theta \approx 2020$ °C. O valor real é maior (~2500 °C): o modelo linear subestima, porque $\rho$ do tungstênio cresce mais rápido que linear em alta temperatura.</p>` }),
      X({ n: 7, marcas: ["★"], enun: R`<p>Você quer $15$ mA num LED vermelho ($2{,}0$ V) com uma bateria de $9$ V. Qual resistor da série E12 você usa, qual a corrente real e quanto o resistor dissipa?</p>`, fig: figCircLED("9 V", "R = ?"),
        dicas: [R`<p>Tensão que sobra para o resistor: $9 - 2$.</p>`, R`<p>$R_\text{ideal} = 7/0{,}015 \approx 467\ \Omega$. Pegue o comercial de cima.</p>`],
        resp: R`$470\ \Omega$; $i \approx 14{,}9$ mA; $P \approx 0{,}10$ W.`, sol: R`<p>$R_\text{ideal} = 467\ \Omega \to 470\ \Omega$. $i = 7/470 = 14{,}9$ mA; $P = 7^2/470 \approx 0{,}104$ W, abaixo dos 0,25 W ✓.</p>` }),
      X({ n: 8, marcas: ["?"], enun: R`<p>Sobre um resistor ôhmico mantido à temperatura constante, é <b>falso</b> afirmar:</p>`, fig: D.svg(260, 150, `${D.eixos({ x0: 40, y0: 130, w: 200, h: 115, xlab: "i", ylab: "U" })}<line x1="40" y1="130" x2="220" y2="30" style="stroke:var(--mod);stroke-width:2.5"/>`, "reta U por i"),
        alts: ["O gráfico $U \\times i$ é uma reta que passa pela origem.", "Se a tensão dobra, a corrente dobra.", "Como $R = U/i$, se a tensão dobra, a resistência dobra.", "A potência dissipada quadruplica se a corrente dobra.", "Se trocarmos por um fio do mesmo material, com o dobro do comprimento e o dobro do diâmetro, a resistência cai à metade."],
        dicas: [R`<p>$R = U/i$ é a <i>definição</i> de R, não diz do que R depende.</p>`, R`<p>Do que R depende, de verdade? (2ª lei)</p>`],
        resp: "C", sol: R`<p>R depende do material, da forma e da temperatura, não de U. Se U dobra, i dobra e a razão fica igual. (E) é verdadeira: $R \propto L/d^2 = 2/4 = 1/2$.</p>` }),
      X({ n: 9, enun: R`<p>Dois fios do mesmo material: A tem comprimento $L$ e diâmetro $d$; B tem comprimento $2L$ e diâmetro $2d$. Quanto vale $R_A/R_B$?</p>`, fig: D.svg(420, 120, `${D.cilindro(40, 35, 160, 10)}${D.txt(20, 40, "A", "tx", "end")}${D.cilindro(40, 90, 320, 20)}${D.txt(20, 95, "B", "tx", "end")}`, "dois fios"),
        dicas: [R`<p>$R \propto L/d^2$.</p>`, R`<p>Para B: $2/2^2 = 1/2$.</p>`],
        resp: R`$R_A/R_B = 2$.`, sol: R`<p>$R_B = \rho\,(2L)/(\pi(2d)^2/4) = R_A\cdot 2/4 = R_A/2$, então $R_A/R_B = 2$.</p>` }),
    ];
    const exsMax = [
      X({ n: 10, marcas: ["∫", "★"], enun: R`<p>Um resistor de nicromo ($\rho = 1{,}1\times10^{-6}\ \Omega\cdot$m) tem forma de tronco de cone com raios $0{,}20$ mm e $0{,}50$ mm e comprimento $20$ cm. (a) Calcule $R$. (b) Um colega aproximou por um cilindro de raio médio $0{,}35$ mm. Quanto ele errou, em porcentagem?</p>`, fig: figCone,
        dicas: [R`<p>Fatie em discos de espessura $dx$; eles estão em série.</p>`, R`<p>Resultado geral: $R = \rho L/(\pi a b)$. Depois compare com $\rho L/(\pi \bar r^2)$.</p>`],
        resp: R`(a) $R \approx 0{,}70\ \Omega$; (b) $0{,}57\ \Omega$, uns $18\%$ abaixo.`, sol: R`<p>(a) $R = \rho L/(\pi ab) = 1{,}1\times10^{-6}\times0{,}20/(\pi\times2{,}0\times10^{-4}\times5{,}0\times10^{-4}) \approx 0{,}700\ \Omega$. (b) $\rho L/(\pi\,0{,}35^2\times10^{-6}) \approx 0{,}572\ \Omega$, erro de $(0{,}700-0{,}572)/0{,}700 \approx 18\%$. A média aritmética dos raios ao quadrado é maior que $ab$ (desigualdade das médias), então a aproximação sempre subestima.</p>` }),
      X({ n: 11, marcas: ["∫", "!"], enun: R`<p>Num cabo coaxial, o isolante entre o fio central (raio $a = 0{,}50$ mm) e a malha (raio $b = 2{,}0$ mm) tem $\rho = 1{,}0\times10^{12}\ \Omega\cdot$m. Para $100$ m de cabo, qual a resistência de <b>vazamento</b> (de dentro para fora) e qual a corrente de fuga com $220$ V?</p>`, fig: figRadial,
        dicas: [R`<p>A corrente vai na direção <b>radial</b>. Uma casca de raio $r$ e espessura $dr$ tem "comprimento" $dr$ e "área" $2\pi r L$.</p>`, R`<p>$dR = \rho\,dr/(2\pi r L)$; integre de $a$ a $b$.</p>`],
        resp: R`$R \approx 2{,}2\times10^{9}\ \Omega$; $i \approx 1{,}0\times10^{-7}$ A.`, sol: R`<p>$R = \dfrac{\rho}{2\pi L}\ln\dfrac{b}{a} = \dfrac{10^{12}\ln 4}{2\pi\times100} \approx 2{,}21\times10^9\ \Omega$. $i = 220/R \approx 1{,}0\times10^{-7}$ A $= 0{,}1\ \mu$A. Note que $R$ cai com $L$: cabo mais longo vaza mais (as cascas ficam "em paralelo" ao longo do comprimento).</p>` }),
      X({ n: 12, marcas: ["∫", "RU", "!"], enun: R`<p><b>Tensão de passo.</b> Um eletrodo de aterramento hemisférico (raio $0{,}50$ m) está num solo de $\rho = 100\ \Omega\cdot$m. Numa falha, $I = 500$ A entram no solo. (a) Qual a resistência de aterramento? (b) Uma pessoa a $10$ m do centro, com os pés separados de $0{,}80$ m na direção radial: qual a tensão entre os pés?</p>`, fig: figTerra,
        dicas: [R`<p>A corrente se espalha em semiesferas: área $2\pi r^2$. Densidade $J = I/(2\pi r^2)$, campo $E = \rho J$.</p>`, R`<p>$V(r) = \rho I/(2\pi r)$ (com $V(\infty) = 0$). A resistência é $\int_a^\infty \rho\,dr/(2\pi r^2)$.</p>`],
        resp: R`(a) $\approx 32\ \Omega$; (b) $\approx 59$ V.`, sol: R`<p>(a) $R = \int_a^\infty \frac{\rho\,dr}{2\pi r^2} = \frac{\rho}{2\pi a} = \frac{100}{\pi} \approx 31{,}8\ \Omega$. (b) $\Delta V = \frac{\rho I}{2\pi}\left(\frac{1}{10} - \frac{1}{10{,}8}\right) \approx 7958\times0{,}00741 \approx 59$ V. Por isso, perto de um raio ou cabo caído, o certo é andar com <b>passos curtos</b> ou pulando com os pés juntos: a ddp entre os pés é proporcional à distância entre eles.</p>` }),
      X({ n: 13, marcas: ["★"], enun: R`<p>Medidas: $U = (6{,}00 \pm 0{,}05)$ V e $i = (24{,}0 \pm 0{,}3)$ mA. Escreva $R$ com sua incerteza, pelo método da derivada logarítmica.</p>`, fig: figR("R", "i = (24,0 ± 0,3) mA"),
        dicas: [R`<p>$\ln R = \ln U - \ln i$.</p>`, R`<p>$\Delta R/R = \Delta U/U + \Delta i/i$.</p>`],
        resp: R`$R = (250 \pm 5)\ \Omega$.`, sol: R`<p>$R = 6{,}00/0{,}0240 = 250\ \Omega$. $\Delta R/R = 0{,}05/6{,}00 + 0{,}3/24{,}0 = 0{,}0083 + 0{,}0125 = 0{,}0208$. $\Delta R = 5{,}2 \to 5\ \Omega$. Resposta: $(250 \pm 5)\ \Omega$.</p>` }),
      X({ n: 14, marcas: ["∫", "!!"], enun: R`<p>Uma barra de $1{,}0$ m e seção $1{,}0$ mm² foi dopada de forma que $\rho(x) = \rho_0\,e^{x/L}$, com $\rho_0 = 1{,}0\times10^{-7}\ \Omega\cdot$m. (a) Calcule $R$. (b) Ligando uma pilha nas pontas, em que posição $x$ fica <b>metade</b> da tensão?</p>`, fig: D.svg(460, 110, `<defs><linearGradient id="gx"><stop offset="0" stop-color="var(--mod)" stop-opacity=".1"/><stop offset="1" stop-color="var(--mod)" stop-opacity=".8"/></linearGradient></defs><rect x="40" y="30" width="380" height="36" fill="url(#gx)" style="stroke:var(--mod)"/>${D.seta(40, 86, 420, 86, "var(--ink2)", 1.4)}${D.txt(40, 104, "x = 0", "tx2", "start")}${D.txt(420, 104, "x = L", "tx2", "end")}${D.txt(230, 22, "ρ(x) = ρ₀ e^(x/L)", "tx2")}`, "barra dopada"),
        dicas: [R`<p>$R = \frac{1}{A}\int_0^L \rho(x)\,dx$.</p>`, R`<p>A corrente é a mesma em toda seção: a queda de tensão até $x$ é proporcional a $\int_0^x \rho\,ds$.</p>`],
        resp: R`(a) $R = \rho_0 L(e-1)/A \approx 0{,}17\ \Omega$; (b) $x = L\ln\frac{e+1}{2} \approx 0{,}62$ m.`, sol: R`<p>(a) $R = \frac{\rho_0}{A}\int_0^L e^{x/L}dx = \frac{\rho_0 L (e-1)}{A} = \frac{10^{-7}\times1\times1{,}718}{10^{-6}} \approx 0{,}172\ \Omega$. (b) $U(x)/U = \frac{e^{x/L}-1}{e-1} = \frac12 \Rightarrow e^{x/L} = \frac{e+1}{2} \Rightarrow x = L\ln\frac{e+1}{2} \approx 0{,}620$ m. Faz sentido: passa do meio porque o começo resiste menos.</p>` }),
      X({ n: 15, marcas: ["RU"], enun: R`<p>Um fio de cobre de $1{,}0$ mm de diâmetro conduz $2{,}0$ A. Há $n = 8{,}5\times10^{28}$ elétrons livres por m³. (a) Quanto tempo um elétron leva para andar $1{,}0$ m? (b) Com $\rho = 1{,}69\times10^{-8}\ \Omega\cdot$m e o modelo de Drude, estime o tempo médio entre colisões $\tau$. ($e = 1{,}60\times10^{-19}$ C, $m_e = 9{,}11\times10^{-31}$ kg)</p>`, fig: figDrude,
        dicas: [R`<p>$i = n e A v_d$.</p>`, R`<p>$\rho = m/(n e^2 \tau)$.</p>`],
        resp: R`(a) $v_d \approx 0{,}19$ mm/s, $t \approx 5{,}3\times10^3$ s $\approx 1{,}5$ h; (b) $\tau \approx 2{,}5\times10^{-14}$ s.`, sol: R`<p>(a) $v_d = i/(neA) = 2/(8{,}5\times10^{28}\times1{,}6\times10^{-19}\times7{,}85\times10^{-7}) \approx 1{,}87\times10^{-4}$ m/s; $t = 1/v_d \approx 5350$ s. (b) $\tau = m/(n e^2\rho) \approx 9{,}11\times10^{-31}/(8{,}5\times10^{28}\times2{,}56\times10^{-38}\times1{,}69\times10^{-8}) \approx 2{,}5\times10^{-14}$ s.</p>` }),
      X({ n: 16, marcas: ["!", "ITA"], enun: R`<p>Um resistor tem $R = R_0(1+\alpha\theta)$, onde $\theta$ é quanto ele está acima da temperatura ambiente; $R_0 = 100\ \Omega$, $\alpha = 4{,}0\times10^{-3}$ K⁻¹. Ele perde calor para o ar a uma taxa $k\theta$, com $k = 0{,}020$ W/K. Ache $\theta$ no equilíbrio se ele for ligado (a) numa fonte de <b>tensão</b> fixa de $12$ V; (b) numa fonte de <b>corrente</b> fixa de $0{,}12$ A. (c) Na fonte de corrente, acima de qual corrente não existe equilíbrio?</p>`, fig: D.svg(480, 150, `${D.fio([[40, 75], [120, 75]])}${D.comp("resistor", 120, 75, 220, 75, { rot: "R(θ)", lado: 1 })}${D.fio([[220, 75], [300, 75]])}${[0, 1, 2].map((k) => `<path d="M${150 + 18 * k} 98 q6 10 0 20 q-6 10 0 20" style="fill:none;stroke:var(--warn);stroke-width:1.6"/>`).join("")}${D.txt(330, 80, "calor perdido = kθ", "tx2", "start")}`, "resistor esquentando"),
        dicas: [R`<p>Equilíbrio: potência elétrica = potência perdida. (a) $U^2/R(\theta) = k\theta$. (b) $I^2R(\theta) = k\theta$.</p>`, R`<p>(a) dá uma equação do 2º grau: $\alpha\theta^2 + \theta - U^2/(kR_0) = 0$. (b) é linear em $\theta$.</p>`],
        resp: R`(a) $\theta \approx 58$ K; (b) $\theta \approx 101$ K; (c) $I > \sqrt{k/(\alpha R_0)} \approx 0{,}22$ A.`, sol: R`<p>(a) $0{,}004\,\theta^2 + \theta - 72 = 0 \Rightarrow \theta = \frac{-1+\sqrt{1+1{,}152}}{0{,}008} \approx 58{,}4$ K. (b) $I^2R_0(1+\alpha\theta) = k\theta \Rightarrow \theta = \frac{I^2R_0}{k - I^2R_0\alpha} = \frac{1{,}44}{0{,}020-0{,}00576} \approx 101$ K. (c) Se $I^2R_0\alpha \ge k$, o denominador zera: a resistência cresce, a potência cresce, ele esquenta mais... <b>disparo térmico</b>. $I_c = \sqrt{0{,}02/0{,}4} \approx 0{,}224$ A. Na fonte de tensão isso não acontece: R maior significa <i>menos</i> potência ($U^2/R$), o que estabiliza.</p>` }),
    ];

    /* ---------- chefão ---------- */
    const chefao = F.chefao({
      titulo: "O LED teimoso",
      enun: R`<p>Um LED vermelho real segue a lei de Shockley $\;i = I_s\left(e^{V/a} - 1\right)$, com $I_s = 3{,}0\times10^{-19}$ A e $a = nV_T = 51{,}7$ mV. Ele está em série com um resistor e uma fonte ideal de $E = 5{,}0$ V. O resistor é de fio de níquel: $R = R_0(1+\alpha\theta)$, com $R_0 = 150\ \Omega$, $\alpha = 6{,}0\times10^{-3}$ K⁻¹, e perde calor a uma taxa $k\theta$, $k = 2{,}0\times10^{-3}$ W/K ($\theta$ = aquecimento acima do ambiente). O LED fica sempre à temperatura ambiente.</p>
        <ol type="a"><li>Com o resistor ainda frio ($\theta = 0$), mostre que a corrente é exatamente $\;i = \dfrac{a}{R}\,W\!\left(\dfrac{I_sR}{a}\,e^{(E+I_sR)/a}\right) - I_s\;$ e calcule $i$ e a tensão no LED.</li>
        <li>Ainda frio: quanto vale $di/dE$? Use isso para prever a corrente com $E = 6{,}0$ V e compare com a conta exata.</li>
        <li>Agora deixe o resistor esquentar até o equilíbrio. Ache $\theta$, $R$ e a nova corrente. O LED ainda está seguro (30 mA)?</li>
        <li>O "modelo de 2 V fixo" teria dado qual corrente em (a)? Explique por que ele funciona tão bem.</li></ol>`,
      fig: figCircLED("5,0 V", "R(θ)"),
      dicas: [
        R`<p>(a) Malha: $E = Ri + a\ln(1 + i/I_s)$. Chame $u = i + I_s$ e isole a exponencial: você quer chegar em algo do tipo $X e^X = \text{constante}$.</p>`,
        R`<p>(a) $\ln(u/I_s) = (E - Ru + RI_s)/a \Rightarrow \frac{Ru}{a}e^{Ru/a} = \frac{RI_s}{a}e^{(E+RI_s)/a}$. O argumento é gigante: use $W(z) \approx \ln z - \ln\ln z$ e depois refine com Newton em $w + \ln w = \ln z$. (b) Derive a malha em relação a $E$: aparece a resistência dinâmica do LED, $a/(i+I_s)$.</p>`,
        R`<p>(c) Dois equilíbrios ao mesmo tempo: elétrico (malha com $R(\theta)$) e térmico ($i^2R = k\theta$). Itere: chute $\theta$, calcule $R$, calcule $i$ pela fórmula de (a), recalcule $\theta = i^2R/k$. Converge rápido.</p>`,
      ],
      sol: R`<p><b>(a)</b> Malha: $E = Ri + a\ln(1+i/I_s)$. Com $u = i + I_s$: $\ln(u/I_s) = (E + RI_s - Ru)/a$, logo $u = I_s\,e^{(E+RI_s)/a}\,e^{-Ru/a}$. Multiplicando por $R/a$ e por $e^{Ru/a}$:</p>
        $$\frac{Ru}{a}\,e^{Ru/a} = \frac{RI_s}{a}\,e^{(E+RI_s)/a}\;\Rightarrow\;\frac{Ru}{a} = W\!\left(\frac{RI_s}{a}e^{(E+RI_s)/a}\right)$$
        <p>Numericamente: $\ln z = \ln(RI_s/a) + E/a = -34{,}68 + 96{,}71 = 62{,}04$. Resolvendo $w + \ln w = 62{,}04$: $w \approx 57{,}99$. Então $i = aw/R - I_s \approx 0{,}0517\times57{,}99/150 \approx 19{,}98$ mA, e $V_\text{LED} = a\ln(1+i/I_s) \approx 2{,}003$ V.</p>
        <p><b>(b)</b> Derivando a malha: $1 = R\,\frac{di}{dE} + \frac{a}{i+I_s}\frac{di}{dE}$, então $\frac{di}{dE} = \frac{1}{R + a/i} = \frac{1}{150 + 2{,}59} \approx 6{,}55$ mA/V. Previsão para 6,0 V: $19{,}98 + 6{,}55 = 26{,}53$ mA. Conta exata com W: $26{,}55$ mA. Quase igual, porque a resistência dinâmica do LED (~2,6 Ω) é minúscula perto de R.</p>
        <p><b>(c)</b> Iterando (ou resolvendo numericamente) $k\theta = i(\theta)^2R(\theta)$: $\theta \approx 26$ K, $R \approx 173\ \Omega$, $i \approx 17{,}3$ mA, $V_\text{LED} \approx 1{,}995$ V, potência no resistor $\approx 52$ mW. Seguro: o aquecimento <i>diminui</i> a corrente (realimentação negativa, como na fonte de tensão do exercício 16).</p>
        <p><b>(d)</b> Modelo de 2 V: $(5-2)/150 = 20{,}0$ mA. Funciona porque a tensão do LED depende só do <b>logaritmo</b> da corrente: dobrar $i$ muda $V$ em $a\ln 2 \approx 36$ mV. Para o circuito, o LED é praticamente uma "bateria ao contrário" de ~2 V.</p>`,
    });

    /* ---------- página ---------- */
    return [
      F.secao("abertura", "Pergunta de abertura", R`<div class="abertura"><div class="det">Antes de tudo</div>
        <div class="q">A mesma corrente passa pelo fio do carregador e pelo filamento de uma lâmpada. Por que um fica frio e o outro brilha a 2500 °C?</div>
        <p class="det">E por que um LED ligado direto numa bateria de 9 V morre em menos de um segundo?</p></div>`),

      F.secao("laboratorio", "Laboratório: circuito vivo", R`<p>Mexa na tensão e na resistência. As bolinhas andam mais rápido quanto maior a corrente. Passou de 30 mA, o LED queima.</p>
        ${F.chute({ q: "com E = 5 V e R = 330 Ω, o que acontece com a velocidade das cargas se você dobrar a resistência para 660 Ω?",
          ops: ["Dobra", "Fica igual: a pilha é a mesma", "Cai pela metade", "Cai para menos da metade"], certa: 2,
          exp: R`<p><b>Cai pela metade.</b> Com o LED segurando 2 V, sobram 3 V no resistor e $i = 3/R$: dobrar R divide a corrente por 2 (9,1 mA → 4,5 mA). Agora confira no laboratório. Repare que, no modelo real (exponencial), a queda é um tiquinho diferente, porque a tensão do LED também muda um pouco.</p>` })}
        <div id="lab-circ"></div>`, ""),

      F.secao("ideia", "A ideia física", R`
        <p>Resistência é <b>atrito para cargas</b>. Os elétrons livres de um metal são acelerados pelo campo elétrico, batem nos íons da rede e perdem a energia ganha, que vira vibração da rede, isto é, <b>calor</b>. No fim, eles andam com uma velocidade média constante, como uma bolinha descendo uma rampa cheia de pregos.</p>
        <p>Números para ter na cabeça:</p>
        <ul><li>1 m de fio de cobre de 1 mm²: $R \approx 0{,}017\ \Omega$. Praticamente nada.</li>
        <li>O filamento de uma lâmpada: uns 200 a 500 Ω aceso, e 10 vezes menos frio.</li>
        <li>Resistores do kit: de 10 Ω a 1 MΩ, aguentando 0,25 W.</li>
        <li>Velocidade média dos elétrons num fio com 1 A: <b>décimos de milímetro por segundo</b>. O sinal elétrico anda perto da velocidade da luz; os elétrons, não.</li>
        <li>Corpo humano, mão a mão, pele seca: da ordem de 10⁵ Ω; molhada, ~10³ Ω. Por isso choque no banho é mais perigoso.</li></ul>
        <p>A resposta da pergunta de abertura: em série, a corrente é a mesma, mas a <b>potência</b> é $P = R\,i^2$. O filamento tem uma resistência milhares de vezes maior que o fio, e fica com quase toda a potência.</p>
        ${F.caixa("fisico", R`<p>Quando dá para desprezar a resistência dos fios? Compare com o resto: 1 m de cabinho tem ~0,02 Ω; o resistor do LED tem 330 Ω. Erro de 0,006%. Despreze sem medo. Já num motor de arranque de carro (resistência ~0,01 Ω), o cabo importa muito: por isso ele é grosso.</p>`)}`),

      F.secao("teoria", "Teoria completa", R`
        <h3>1. Resistência elétrica: a definição</h3>
        <p>Pegue um componente qualquer, aplique uma tensão $U$ entre seus terminais e meça a corrente $i$. A <b>resistência</b> (сопротивление) é definida como</p>
        ${F.formula(R`R = \frac{U}{i}\qquad [R] = \frac{\text{V}}{\text{A}} = \Omega\ \text{(ohm)}`, "Definição")}
        <p>Isso é só uma definição: vale para qualquer coisa, e o número pode mudar com $U$. A <b>Lei de Ohm</b> (закон Ома) é uma afirmação experimental mais forte: para muitos materiais (metais, à temperatura fixa), $R$ <b>não depende</b> de $U$ nem de $i$. Esses componentes se chamam <b>ôhmicos</b> e seu gráfico $U\times i$ é uma reta pela origem.</p>
        <p>Quando o gráfico é curvo (lâmpada, LED, diodo, termistor), definimos duas resistências diferentes no mesmo ponto:</p>
        ${F.formula(R`R_\text{estática} = \frac{U}{i}\qquad\qquad r_\text{dinâmica} = \frac{dU}{di}`)}
        <p>A estática é a inclinação da reta que liga a origem ao ponto; a dinâmica é a inclinação da tangente. A dinâmica é que diz <i>como o componente responde a uma pequena mudança</i>, e é ela que aparece no chefão. Mexa abaixo:</p>
        <div id="lab-curvas"></div>
        ${F.caixa("pegadinha", R`<p>"$R = U/i$, então se eu dobrar $U$, $R$ dobra." <b>Errado.</b> Num ôhmico, dobrar $U$ dobra $i$, e a razão fica igual. A fórmula define R; quem diz do que R depende é a 2ª lei de Ohm (seção 3).</p>`)}

        <h3>2. Por que existe resistência: o modelo de Drude</h3>
        <p>Em 1900, Paul Drude tratou os elétrons livres de um metal como um gás de bolinhas. Cada elétron é acelerado pelo campo $\vec E$ e, de vez em quando, bate num íon e "esquece" a velocidade que tinha ganho, saindo numa direção aleatória.</p>
        ${F.fig(figDrude, "O caminho do elétron é um zigue-zague; o campo só adiciona uma deriva lenta na direção oposta a E.")}
        ${F.demo("a Lei de Ohm local", R`
          <p>(i) Entre duas colisões, o elétron (carga $-e$, massa $m$) sofre a força $-e\vec E$, então ganha velocidade $\Delta \vec v = -\frac{e\vec E}{m}\,t$, onde $t$ é o tempo desde a última colisão.</p>
          <p>(ii) Logo depois de cada colisão a velocidade é aleatória, com média zero. Fazendo a média sobre todos os elétrons, o tempo médio desde a última colisão é $\tau$ (tempo livre médio). A velocidade média, a <b>velocidade de deriva</b>, é</p>
          $$\vec v_d = -\frac{e\tau}{m}\vec E$$
          <p>(iii) Densidade de corrente: em $dt$, os elétrons de um cilindro de base $A$ e altura $v_d\,dt$ atravessam a base. São $n A v_d\,dt$ elétrons, carga $neAv_d\,dt$. Então $i = neAv_d$ e</p>
          $$\vec J = \frac{i}{A}\hat{\text{n}} = -ne\vec v_d = \frac{ne^2\tau}{m}\vec E$$
          <p>(iv) Definindo a <b>condutividade</b> $\sigma = \dfrac{ne^2\tau}{m}$ e a <b>resistividade</b> $\rho = 1/\sigma$:</p>
          ${F.formula(R`\vec J = \sigma\vec E \qquad\Longleftrightarrow\qquad \vec E = \rho\,\vec J,\qquad \rho = \frac{m}{ne^2\tau}`, "Lei de Ohm local")}
          <p>Nada no resultado depende de $E$: é exatamente por isso que o metal é ôhmico.</p>`)}
        ${F.caixa("fisico", R`<p>Ordens de grandeza no cobre: $n \approx 8{,}5\times10^{28}$ m⁻³ (um elétron livre por átomo). Com $\rho = 1{,}7\times10^{-8}\ \Omega\cdot$m, sai $\tau \approx 2{,}5\times10^{-14}$ s. Com 1 A num fio de 1 mm², $v_d = i/(neA) \approx 7\times10^{-5}$ m/s: menos de um décimo de milímetro por segundo. Os elétrons se movem por agitação térmica a ~10⁶ m/s; a deriva é uma correnteza minúscula por cima disso.</p>`)}
        ${F.caixa("ponte", R`<p>O modelo de Drude acerta a lei de Ohm, mas erra outras coisas (o calor específico dos elétrons, por exemplo). A versão certa usa a mecânica quântica: os elétrons obedecem ao princípio de Pauli (modelo de Sommerfeld), e numa rede perfeita eles <i>não</i> colidiriam com os íons. A resistência vem das imperfeições e das vibrações da rede (fônons). Em materiais anisotrópicos, $\sigma$ vira um tensor: $J_i = \sigma_{ij}E_j$.</p>`)}

        <h3>3. Da lei local à 2ª lei de Ohm</h3>
        ${F.fig(figFio, "Fio uniforme: campo E e densidade de corrente J iguais em toda a seção.")}
        ${F.demo("R = ρL/A", R`
          <p>(i) Num fio uniforme de comprimento $L$ e seção $A$, por simetria, $\vec E$ é uniforme e paralelo ao fio. A ddp é $U = V_1 - V_2 = \int \vec E\cdot d\vec\ell = EL$ ${F.ret("C04")}.</p>
          <p>(ii) A corrente se espalha igualmente pela seção: $i = JA$.</p>
          <p>(iii) Lei local: $E = \rho J$. Então $U = EL = \rho JL = \rho \dfrac{i}{A}L$.</p>
          <p>(iv) Comparando com $U = Ri$:</p>
          ${F.formula(R`R = \rho\,\frac{L}{A}`, "2ª Lei de Ohm")}`)}
        <p>Interpretação: <b>comprimento</b> é caminho a mais para atrapalhar (resistências em série se somam); <b>área</b> é caminho em paralelo (mais área, mais "pistas"). A unidade de $\rho$ é $\Omega\cdot$m. A resistividade (удельное сопротивление) depende só do material e da temperatura.</p>
        <div id="lab-fio"></div>
        <table class="tb"><tr><th>Material (20 °C)</th><th>ρ (Ω·m)</th><th>α (°C⁻¹)</th></tr>
          <tr><td>Prata</td><td>1,6 × 10⁻⁸</td><td>4,1 × 10⁻³</td></tr>
          <tr><td>Cobre</td><td>1,7 × 10⁻⁸</td><td>4,3 × 10⁻³</td></tr>
          <tr><td>Alumínio</td><td>2,8 × 10⁻⁸</td><td>4,4 × 10⁻³</td></tr>
          <tr><td>Tungstênio</td><td>5,3 × 10⁻⁸</td><td>4,5 × 10⁻³</td></tr>
          <tr><td>Ferro</td><td>9,7 × 10⁻⁸</td><td>6,5 × 10⁻³</td></tr>
          <tr><td>Constantan</td><td>4,9 × 10⁻⁷</td><td>~1 × 10⁻⁵</td></tr>
          <tr><td>Nicromo</td><td>1,1 × 10⁻⁶</td><td>4 × 10⁻⁴</td></tr>
          <tr><td>Silício puro</td><td>~2 × 10³</td><td>negativo</td></tr>
          <tr><td>Vidro</td><td>10¹⁰ a 10¹⁴</td><td></td></tr></table>
        <p class="det" style="color:var(--ink2)">Valores típicos; dependem da pureza da amostra. Repare na faixa: de 10⁻⁸ a 10¹⁴, são 22 ordens de grandeza. Poucas grandezas físicas variam tanto.</p>
        ${F.caixa("olimpiada", R`<p><b>Fio esticado.</b> Esticar sem perder material conserva o volume $LA$. Se $L \to kL$, então $A \to A/k$ e $R \to k^2R$. Em função do diâmetro: $L \propto 1/d^2$, então $R \propto L/d^2 \propto 1/d^4$. Afinar o fio pela metade (esticando) multiplica R por 16.</p>`)}

        <h3>4. Resistividade e temperatura</h3>
        <p>Esquentar um metal aumenta a vibração dos íons, os elétrons batem mais vezes, $\tau$ diminui e $\rho = m/(ne^2\tau)$ aumenta. Numa faixa de algumas centenas de graus, a dependência é quase linear:</p>
        ${F.formula(R`\rho(\theta) = \rho_0\left[1 + \alpha\,(\theta - \theta_0)\right]\quad\Rightarrow\quad R(\theta) \approx R_0\left[1 + \alpha\,(\theta - \theta_0)\right]`)}
        <p>(Na segunda forma, desprezamos a dilatação do fio: ela muda $L/A$ em ~10⁻⁵ por grau, contra ~10⁻³ de $\alpha$.)</p>
        <ul><li><b>Metais</b>: $\alpha > 0$, ~$4\times10^{-3}$ °C⁻¹. Termômetro de resistência de platina (PT100) usa isso.</li>
        <li><b>Ligas como constantan</b>: $\alpha \approx 0$. Usadas em resistores de precisão.</li>
        <li><b>Semicondutores</b> (e termistores NTC): $\rho$ <i>cai</i> com a temperatura, porque o calor libera mais portadores ($n$ cresce muito mais do que $\tau$ cai).</li></ul>
        ${F.caixa("ponte", R`<p><b>Supercondutores</b>: abaixo de uma temperatura crítica (9,2 K no nióbio), $\rho$ cai a <i>exatamente</i> zero. Uma corrente numa espira supercondutora roda por anos sem enfraquecer. Explicação: teoria BCS (1957), puramente quântica.</p>`)}

        <h3>5. Condutores de seção variável ∫</h3>
        <p>Se a seção (ou a resistividade) muda ao longo do caminho, fatie o condutor em pedaços tão finos que cada um é uniforme. Pedaços um depois do outro estão <b>em série</b>, e resistências em série se somam ${F.ret("C08")}:</p>
        ${F.formula(R`R = \int \frac{\rho\,d\ell}{A(\ell)}`, "Regra geral")}
        <p>Cuidado: isso supõe que as superfícies de mesmo potencial são as fatias. Vale bem quando a seção muda devagar, ou quando a simetria garante (radial, esférica).</p>
        ${F.fig(figCone)}
        ${F.demo("tronco de cone", R`
          <p>(i) Raio linear: $r(x) = a + \frac{b-a}{L}x$. (ii) $dR = \frac{\rho\,dx}{\pi r^2}$, com $dx = \frac{L}{b-a}dr$.</p>
          <p>(iii) $R = \frac{\rho L}{\pi(b-a)}\int_a^b r^{-2}\,dr = \frac{\rho L}{\pi(b-a)}\cdot\frac{b-a}{ab}$:</p>
          ${F.formula(R`R_\text{cone} = \frac{\rho L}{\pi a b}`)}`)}
        ${F.fig(figRadial, "Corrente radial: as fatias são cascas cilíndricas.")}
        ${F.demo("corrente radial entre cilindros", R`
          <p>(i) Uma casca de raio $r$, espessura $dr$ e altura $L$: o "comprimento" percorrido é $dr$ e a "área" atravessada é $2\pi rL$.</p>
          <p>(ii) $R = \int_a^b \frac{\rho\,dr}{2\pi rL} = \frac{\rho}{2\pi L}\ln\frac{b}{a}$.</p>
          ${F.formula(R`R_\text{radial} = \frac{\rho}{2\pi L}\ln\frac{b}{a}`)}`)}
        <p>Na geometria esférica (casca entre raios $a$ e $b$), a área é $4\pi r^2$ e $R = \frac{\rho}{4\pi}\left(\frac1a - \frac1b\right)$. Com $b\to\infty$, a resistência é <b>finita</b>: $\rho/(4\pi a)$. Quase toda ela está perto do eletrodo.</p>
        ${F.caixa("olimpiada", R`<p><b>Aterramento e tensão de passo.</b> Uma semiesfera de raio $a$ enterrada no solo tem $R = \rho/(2\pi a)$ (metade da esfera, área $2\pi r^2$). A corrente $I$ que entra no solo cria o potencial $V(r) = \rho I/(2\pi r)$. Entre dois pés afastados $s$ na direção radial, $\Delta V \approx \frac{\rho I}{2\pi r^2}\,s$. É o exercício 12 e um clássico de olimpíada russa.</p>`)}
        ${F.fig(figTerra)}

        <h3>6. Potência e efeito Joule</h3>
        ${F.demo("P = U i", R`
          <p>(i) Por definição de tensão ${F.ret("C04")}, uma carga $dq$ que atravessa uma ddp $U$ perde energia potencial $dW = U\,dq$.</p>
          <p>(ii) Num resistor, as cargas saem com a mesma velocidade de deriva com que entraram: a energia não vira energia cinética. Vira calor (colisões com a rede).</p>
          <p>(iii) A potência é $P = \frac{dW}{dt} = U\frac{dq}{dt} = U\,i$. Usando $U = Ri$:</p>
          ${F.formula(R`P = U\,i = R\,i^2 = \frac{U^2}{R}`, "Efeito Joule")}`)}
        <p>Versão local: por unidade de volume, $p = \vec J\cdot\vec E = \sigma E^2 = \rho J^2$. É útil quando a corrente não é uniforme.</p>
        <p><b>Qual das três formas usar?</b> A que tiver a grandeza <b>fixa</b> do problema. Na tomada, a tensão é fixa: use $U^2/R$. Componentes em série dividem a mesma corrente: use $Ri^2$.</p>
        ${F.caixa("pegadinha", R`<p><b>Chuveiro: inverno ou verão?</b> No inverno você quer mais potência. Como $U = 220$ V é fixo, $P = U^2/R$: mais potência exige <b>menos</b> resistência. A chave "inverno" usa um <i>pedaço menor</i> do fio. Quem pensa em $P = Ri^2$ ("mais R, mais calor") erra, porque esquece que $i$ também muda.</p>`)}
        <p>Na prática: resistores têm uma <b>potência nominal</b> (1/8, 1/4, 1/2, 1 W...). Acima dela esquentam demais e queimam. O fusível usa isso de propósito: é um fio fino que derrete quando $Ri^2$ passa do limite.</p>

        <h3>7. Componentes não ôhmicos: diodo e LED</h3>
        <p>Um LED é um diodo semicondutor. Abaixo de uma tensão de "joelho" (~2 V no vermelho, ~3 V no azul) praticamente não conduz. Acima dela, a corrente cresce <b>exponencialmente</b>:</p>
        ${F.formula(R`i = I_s\left(e^{V/(nV_T)} - 1\right),\qquad V_T = \frac{k_BT}{e} \approx 25{,}9\ \text{mV a } 27\,{}^\circ\text{C}`, "Equação de Shockley")}
        <p>Com $n \approx 2$, cada 36 mV a mais <i>dobram</i> a corrente. Por isso ligar um LED direto numa pilha é fatal: não existe nada para limitar a corrente. O resistor em série faz isso: quem define a corrente passa a ser ele, e o LED só "come" uns 2 V fixos.</p>
        ${F.caixa("fisico", R`<p><b>Modelo de 2 V fixo.</b> Como $V = nV_T\ln(1 + i/I_s)$ depende do logaritmo de $i$, variar a corrente de 10 para 20 mA muda a tensão do LED em só ~36 mV. Para o circuito, o LED é uma "pilha ao contrário" de ~2 V. É o modelo do laboratório no modo ideal. O modo real resolve a equação exata (com a função W de Lambert, veja o chefão).</p>`)}

        <h3>8. Resistores na prática</h3>
        <p>Os valores comerciais seguem a <b>série E12</b> (tolerância de 10%): 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, vezes potências de 10. Cada valor é ~21% maior que o anterior ($10^{1/12} \approx 1{,}21$). Com a tolerância, as faixas de dois valores vizinhos se encostam, e nenhum resistor "fica sem nome".</p>
        <p><b>Código de cores</b> (4 faixas): 1º algarismo, 2º algarismo, multiplicador (quantos zeros), tolerância. Preto 0, marrom 1, vermelho 2, laranja 3, amarelo 4, verde 5, azul 6, violeta 7, cinza 8, branco 9; dourado ±5%, prateado ±10%. Exemplo: amarelo-violeta-marrom-dourado = 47 × 10 = 470 Ω ± 5%.</p>

        <h3>9. Medindo R com incerteza (estilo OBF)</h3>
        <p>Com $R = U/i$, o método da <b>derivada logarítmica</b>: $\ln R = \ln U - \ln i$, então $\frac{dR}{R} = \frac{dU}{U} - \frac{di}{i}$. Para incertezas (pior caso), somam-se os módulos:</p>
        ${F.formula(R`\frac{\Delta R}{R} = \frac{\Delta U}{U} + \frac{\Delta i}{i}`)}
        <p>Regra geral: se $G = k\,x^a y^b$, então $\frac{\Delta G}{G} = |a|\frac{\Delta x}{x} + |b|\frac{\Delta y}{y}$. A incerteza final fica com 1 algarismo significativo (2, se começar com 1), e o valor é arredondado na mesma casa decimal.</p>
        ${F.caixa("olimpiada", R`<p>Para achar R com várias medidas, o melhor é fazer o gráfico $U\times i$ e tirar a <b>inclinação</b> da melhor reta (não a média das razões U/i). Se a reta não passar pela origem, existe um erro sistemático, por exemplo, um amperímetro mal zerado ou uma resistência de contato.</p>`)}`),

      F.secao("exemplos", "Exemplos passo a passo", exemplario),

      F.secao("resumo", "Resumo", R`<div class="resumo">
        <div class="r"><b>Definição</b>$R = U/i$; ôhmico: R não depende de U.</div>
        <div class="r"><b>Lei local (Drude)</b>$\vec J = \sigma\vec E$, $\rho = 1/\sigma = m/(ne^2\tau)$</div>
        <div class="r"><b>2ª lei</b>$R = \rho L/A$; esticar $k$ vezes: $R \to k^2R$</div>
        <div class="r"><b>Temperatura</b>$R = R_0[1 + \alpha\Delta\theta]$; metal α>0, semicondutor α<0</div>
        <div class="r"><b>Seção variável</b>$R = \int\rho\,d\ell/A$; cone $\rho L/(\pi ab)$; radial $\frac{\rho}{2\pi L}\ln\frac ba$</div>
        <div class="r"><b>Joule</b>$P = Ui = Ri^2 = U^2/R$; use a forma com a grandeza fixa</div>
        <div class="r"><b>LED</b>~2 V fixos; $R = (E - U_\text{LED})/i$, comercial de cima</div>
        <div class="r"><b>Incerteza</b>$\Delta R/R = \Delta U/U + \Delta i/i$</div>
      </div>`),

      F.secao("exercicios", "Exercícios", `<div class="exs-nivel"><h3>Nível Físico</h3><span class="selo">fixação</span></div>${exsFisico.join("")}
        <div class="exs-nivel"><h3>Nível Máximo</h3><span class="selo">OBF · ITA · RU</span></div>${exsMax.join("")}`),

      F.secao("chefao", "Chefão", chefao),
    ].join("");
  },
  montar(F) {
    const c = document.getElementById("lab-circ");
    c.outerHTML = F.lab("Pilha + resistor + LED", "lab-circ");
    SIM.circuito(document.getElementById("lab-circ"), F);
    const u = document.getElementById("lab-curvas");
    u.outerHTML = F.lab("Curva característica U × i", "lab-curvas");
    SIM.curvas(document.getElementById("lab-curvas"), F);
    const f = document.getElementById("lab-fio");
    f.outerHTML = F.lab("Bancada do fio: R = ρL/A", "lab-fio");
    SIM.fio(document.getElementById("lab-fio"), F);
  },
});
