"""Corrige F.n( / F.m( usados em TEXTO COMUM (fora de $...$) nos temas: troca por F.nt( / F.t(. Origem dos "{,}" vazando (β 4.7).
   Lê cada modelo de texto (crases) sabendo se está dentro ou fora de fórmula; modelos aninhados herdam o estado de onde estão;
   se a própria expressão põe o $ em volta ("$" + F.n(x) + "$"), não mexe. Uso, da raiz do repositório:
     python3 tools/corrige-virgula.py              (só mostra o que mudaria; use --contexto para ver cada trecho)
     python3 tools/corrige-virgula.py --aplica     (aplica; depois rodar node tests/tchaves.js <códigos> e node tools/gera-indice.js)
   REVISAR as trocas antes de aplicar: o corretor não sabe de casos como "R$" (dinheiro) ou "<" colado em letra dentro de $...$."""
import sys, glob, re, os
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APLICA = '--aplica' in sys.argv
def troca_estado(mat, tipo):  # tipo 'i' ($) ou 'd' ($$)
    if mat is None: return tipo
    return None if mat == tipo else mat
def analisa(txt):
    n=len(txt); pos=[]
    def template(i, mat):  # mat herdado: um template aninhado dentro de $...$ continua em math
        while i<n:
            c=txt[i]
            if c=='\\': i+=2; continue
            if c=='`': return i+1
            if c=='$':
                L=0
                while i+L<n and txt[i+L]=='$': L+=1
                if i+L<n and txt[i+L]=='{':
                    m=L-1
                    if m==1: mat=troca_estado(mat,'i')
                    elif m==2: mat=troca_estado(mat,'d')
                    i=expr(i+L+1, mat); continue
                mat=troca_estado(mat,'i' if L==1 else 'd'); i+=L; continue
            i+=1
        return i
    def expr(i, mat):
        prof=1; ini=i; tops=[]  # trechos do "nível de cima" da expressão (fora de templates aninhados)
        seg_ini=i
        while i<n:
            c=txt[i]
            if c in '"\'':
                j=i+1
                while j<n and txt[j]!=c: j+=2 if txt[j]=='\\' else 1
                i=j+1; continue
            if c=='`': tops.append((seg_ini,i)); i=template(i+1, mat); seg_ini=i; continue
            if c=='{': prof+=1
            if c=='}':
                prof-=1
                if prof==0:
                    tops.append((seg_ini,i))
                    if mat is None: pos.append((ini,i,tops))
                    return i+1
            i+=1
        return i
    i=0
    while i<n:
        c=txt[i]
        if txt.startswith('//',i): j=txt.find('\n',i); i=n if j<0 else j; continue
        if txt.startswith('/*',i): i=txt.find('*/',i)+2; continue
        if c in '"\'':
            j=i+1
            while j<n and txt[j]!=c and txt[j]!='\n': j+=2 if txt[j]=='\\' else 1
            i=j+1; continue
        if c=='`': i=template(i+1, None); continue
        i+=1
    return pos
tot=0; lista=[]
for f in sorted(glob.glob(os.path.join(RAIZ, 'temas', '**', '*.js'), recursive=True)):
    txt=open(f).read(); pos=analisa(txt); novo=list(txt); trocas=[]
    for a,b,tops in pos:
        seg=txt[a:b]
        if re.search(r'''["']\$''', seg): continue  # a expressão põe o $ em volta: já está em math
        for (x,y) in tops:
            for mm in re.finditer(r'\bF\.(n|m)\(', txt[x:y]):
                trocas.append((x+mm.start(), mm.group(1)))
    for k,nome in sorted(set(trocas), reverse=True):
        rep='F.nt(' if nome=='n' else 'F.t('; ant='F.n(' if nome=='n' else 'F.m('
        assert txt[k:k+len(ant)]==ant; novo[k:k+len(ant)]=list(rep)
    if trocas:
        tot+=len(set(trocas)); lista.append(f.split('temas/')[1])
        for k,_ in sorted(set(trocas)):
            if '--contexto' in sys.argv: ln=txt.count('\n',0,k)+1; print(f.split('temas/')[1], ln, '…'+txt[max(0,k-50):k+28].replace('\n',' ')+'…')
        if APLICA: open(f,'w').write(''.join(novo))
print(len(lista),'arquivos:', ' '.join(lista)); print('total de trocas:', tot, '(aplicado)' if APLICA else '(simulação)')
