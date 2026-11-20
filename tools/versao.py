#!/usr/bin/env python3
"""Troca a versão do site nos três lugares e carimba os arquivos do index.html com ?v=<número>.

Uso:  python3 tools/versao.py 0.2        (vira "α 0.2")
      python3 tools/versao.py            (só confere e mostra a versão atual)

O carimbo (?v=0.2 no fim de cada script e folha de estilo) existe por causa do navegador: sem ele, depois de uma publicação
o navegador continua usando os arquivos antigos que guardou, e o site parece não ter mudado (aconteceu na α 0.1: o título
mostrava a versão nova e o resto era o da β 8.8). Com o endereço diferente a cada versão, ele é obrigado a buscar de novo.
Os arquivos carregados depois (temas, índice da busca, catálogo de moléculas) levam o mesmo carimbo pelo código (VERSAO).
"""
import re, sys, pathlib

RAIZ = pathlib.Path(__file__).resolve().parent.parent
LETRA = "α"


def main():
    cat = RAIZ / "assets/catalogo.js"
    s = cat.read_text(encoding="utf-8")
    m = re.search(r'window\.VERSAO = "([^"]+)";', s)
    atual = m.group(1)
    if len(sys.argv) < 2:
        idx = (RAIZ / "index.html").read_text(encoding="utf-8")
        num = re.sub(r"[^0-9.]", "", atual)
        sem = [x for x in re.findall(r'(?:src|href)="((?:assets|temas)/[^"]+\.(?:js|css))(\?v=[0-9.]+)?"', idx) if x[1] != "?v=" + num]
        print(f"versão atual: {atual}; arquivos do index.html sem o carimbo ?v={num}: {len(sem)}")
        sys.exit(1 if sem else 0)
    num = sys.argv[1].replace(",", ".")
    if not re.fullmatch(r"\d+\.\d+", num):
        sys.exit("escreva só o número, por exemplo: 0.2")
    nova = f"{LETRA} {num}"
    cat.write_text(s.replace(m.group(0), f'window.VERSAO = "{nova}";'), encoding="utf-8")
    p = RAIZ / "index.html"
    idx = p.read_text(encoding="utf-8")
    idx, n1 = re.subn(r"<title>Jarvis [^·<]*·", f"<title>Jarvis {nova} ·", idx, count=1)
    idx, n2 = re.subn(r'((?:src|href)="(?:assets|temas)/[^"?]+\.(?:js|css))(?:\?v=[0-9.]+)?"', rf'\1?v={num}"', idx)
    p.write_text(idx, encoding="utf-8")
    p = RAIZ / "README.md"
    r = p.read_text(encoding="utf-8")
    r, n3 = re.subn(r"^# Jarvis .*$", f"# Jarvis {nova}", r, count=1, flags=re.M)
    p.write_text(r, encoding="utf-8")
    print(f"{atual} → {nova}: título {n1}, arquivos carimbados no index.html {n2}, README {n3}")
    if not (n1 == 1 and n2 > 50 and n3 == 1):
        sys.exit("FALHA: algum dos três lugares não foi achado")


if __name__ == "__main__":
    main()
