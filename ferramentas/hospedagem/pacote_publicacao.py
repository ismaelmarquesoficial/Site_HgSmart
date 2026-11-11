#!/usr/bin/env python3
"""Monta a pasta que vai para a raiz pública da hospedagem (e só ela).

    python3 ferramentas/hospedagem/pacote_publicacao.py <pasta de saída>

Entra: .htaccess, robots.txt, sitemap.xml, os .html da raiz, lojas/**/index.html e, de assets/, só o que
essas páginas e o CSS referenciam (css, js, vendor, fontes, imagens). Fica de fora todo o material interno
(Fotos, Site Planejamento, docs, ferramentas, design-system, mídia sem uso em assets/hero, video e audio).
No fim imprime a contagem e o tamanho; termina com erro se alguma referência não existir no disco.
"""
import os, re, shutil, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REF = re.compile(r'(?:href|src|poster|content)=["\']([^"\']+)["\']|srcset=["\']([^"\']+)["\']|url\(["\']?([^)"\']+)')


def paginas():
    for n in sorted(os.listdir(RAIZ)):
        if n.endswith('.html'): yield n
    for raiz, _, arqs in os.walk(os.path.join(RAIZ, 'lojas')):
        for a in arqs:
            if a.endswith('.html'): yield os.path.relpath(os.path.join(raiz, a), RAIZ)


def referencias(rel, texto):
    base = os.path.dirname(rel)
    for m in REF.finditer(texto):
        bruto = m.group(1) or m.group(3) or ''
        cands = [c.strip().split(' ')[0] for c in m.group(2).split(',')] if m.group(2) else [bruto]
        for c in cands:
            c = c.split('#')[0].split('?')[0]
            if not c or c.startswith(('http:', 'https:', 'mailto:', 'tel:', 'sms:', 'data:', '//', 'javascript:', '%23')): continue
            caminho = os.path.normpath(os.path.join(base, c)) if not c.startswith('/') else c.lstrip('/')
            if caminho.startswith('assets/') or caminho.endswith('.html'): yield caminho


def main():
    if len(sys.argv) != 2: sys.exit(__doc__)
    saida = os.path.abspath(sys.argv[1])
    if os.path.exists(saida): shutil.rmtree(saida)
    arquivos = {'.htaccess', 'robots.txt', 'sitemap.xml'}; faltando = set()
    for p in paginas():
        arquivos.add(p)
        for r in referencias(p, open(os.path.join(RAIZ, p), encoding='utf-8').read()):
            (arquivos if os.path.isfile(os.path.join(RAIZ, r)) else faltando).add(r)
    for css in [a for a in list(arquivos) if a.endswith('.css')]:
        for r in referencias(css, open(os.path.join(RAIZ, css), encoding='utf-8').read()):
            (arquivos if os.path.isfile(os.path.join(RAIZ, r)) else faltando).add(r)
    total = 0
    for a in sorted(arquivos):
        d = os.path.join(saida, a); os.makedirs(os.path.dirname(d), exist_ok=True)
        shutil.copy2(os.path.join(RAIZ, a), d); total += os.path.getsize(d)
    print(f"{len(arquivos)} arquivos, {total/1048576:.1f} MB em {saida}")
    por_pasta = {}
    for a in arquivos: por_pasta[a.split('/')[0] if '/' in a else '(raiz)'] = por_pasta.get(a.split('/')[0] if '/' in a else '(raiz)', 0) + 1
    print("por pasta:", dict(sorted(por_pasta.items())))
    if faltando:
        print("REFERÊNCIAS SEM ARQUIVO:", sorted(faltando)[:20]); sys.exit(1)


if __name__ == '__main__':
    main()
