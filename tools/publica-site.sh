#!/bin/bash
# Gera a branch gh-pages (a que o GitHub Pages serve) SÓ com os arquivos do site, a partir do commit atual.
# Uso: bash tools/publica-site.sh        (depois: git push origin gh-pages)
# Nada de CLAUDE.md, PROGRESSO.md, docs/, tests/ ou tools/ vai para lá. A branch é gerada: não editar à mão.
set -e
cd "$(git rev-parse --show-toplevel)"
ORIGEM=$(git rev-parse --short HEAD)
if [ -n "$(git status --porcelain)" ]; then echo "Há mudanças sem commit: faça o commit antes de publicar."; exit 1; fi
TMP=$(mktemp -d); export GIT_INDEX_FILE="$TMP/index"
git read-tree --empty
for f in index.html .nojekyll robots.txt sitemap.xml; do git update-index --add --cacheinfo "$(git ls-tree HEAD "$f" | awk '{print $1","$3}'),$f"; done
git read-tree --prefix=assets/ HEAD:assets
git read-tree --prefix=temas/ HEAD:temas
ARVORE=$(git write-tree); unset GIT_INDEX_FILE; rm -rf "$TMP"
PAI=$(git rev-parse -q --verify refs/heads/gh-pages || true)
COMMIT=$(git commit-tree "$ARVORE" ${PAI:+-p "$PAI"} -m "Site publicado a partir de $ORIGEM")
git update-ref refs/heads/gh-pages "$COMMIT"
echo "gh-pages -> $COMMIT (a partir de $ORIGEM); arquivos na raiz:"; git ls-tree --name-only gh-pages
