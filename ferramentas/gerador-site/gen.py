# -*- coding: utf-8 -*-
"""Gerador do site da Rede HG Smart. As páginas publicadas continuam sendo HTML/CSS/JS puro, sem build no servidor:
este script só evita manter à mão o cabeçalho, o rodapé e os dados das lojas em 31 arquivos.

  python3 gen.py repo            escreve na raiz do repositório: as páginas, assets/css/hg.css, assets/js/hg.js,
                                 as imagens novas que ainda não existirem e a pasta design-system/ (tokens e referência).
                                 Não apaga nem regrava imagem existente.
                                 O <title>, a descrição, o canonical, o Open Graph e os JSON-LD de cada página
                                 são lidos da página que já está no repositório e mantidos como estão.
  python3 gen.py artefato DIR    monta em DIR um pacote de pré-visualização (fontes embutidas, imagens reduzidas,
                                 index.html sem <head> e a mesma página inteira em inicio.html).

Precisa de Python 3 e Pillow. O repositório é a pasta dois níveis acima deste arquivo, ou a variável HG_REPO."""
import os, re, json, shutil, base64, sys
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
REPO = os.environ.get('HG_REPO') or os.path.abspath(os.path.join(HERE, '..', '..'))
REPO = REPO.rstrip('/') + '/'
assert os.path.exists(REPO + 'assets/vendor/gsap.min.js'), 'repositório não encontrado em ' + REPO
MODO = sys.argv[1] if len(sys.argv) > 1 else ''
assert MODO in ('repo', 'artefato'), __doc__
MODO_REPO = MODO == 'repo'
OUT = REPO.rstrip('/') if MODO_REPO else os.path.abspath(sys.argv[2])
import base
from base import CFG, DIM, documento, esc
from dados import LOJAS, PAGAMENTOS
import paginas as P, paginas2 as P2
CFG['artefato'] = not MODO_REPO
CFG['home'] = 'index.html' if MODO_REPO else 'inicio.html'
if not MODO_REPO and os.path.isdir(OUT): shutil.rmtree(OUT)
def caminho(rel):
    p = os.path.join(OUT, rel); os.makedirs(os.path.dirname(p), exist_ok=True); return p
escritos = []
def grava(rel, texto):
    open(caminho(rel), 'w', encoding='utf-8', newline='\n').write(texto); escritos.append(rel)

# ───────── imagens ─────────
def ja_existe(rel):
    """No repositório, imagem que já existe fica como está: só registramos a dimensão para os atributos width/height."""
    if MODO_REPO and os.path.exists(REPO + rel):
        DIM[rel] = Image.open(REPO + rel).size; return True
    return False
def webp(src, rel, maxlado=1100, q=74, corte=None):
    if ja_existe(rel): return
    im = Image.open(src).convert('RGB')
    if corte: im = im.crop(corte)
    m = max(im.size)
    if m > maxlado: im = im.resize((round(im.width * maxlado / m), round(im.height * maxlado / m)), Image.LANCZOS)
    im.save(caminho(rel), 'WEBP', quality=q, method=6); DIM[rel] = im.size; escritos.append(rel)
def copia(src, rel):
    if ja_existe(rel): return
    shutil.copy(src, caminho(rel)); escritos.append(rel)
    try: DIM[rel] = Image.open(src).size
    except Exception: pass

A = REPO + 'assets/'
LOGO = 'assets/img/icones/logo-400.png'
if not ja_existe(LOGO):
    logo = Image.open(A + 'img/icones/LOGO.png').convert('RGBA'); logo = logo.resize((400, round(logo.height * 400 / logo.width)), Image.LANCZOS)
    logo.save(caminho(LOGO), optimize=True); DIM[LOGO] = logo.size; escritos.append(LOGO)
copia(A + 'img/icones/FAVICON.png', 'assets/img/icones/FAVICON.png')
webp(A + 'img/fotos/fachada-matriz.webp', 'assets/img/fotos/hero.webp', 1440, 58)          # LCP da home: fica abaixo de 150 KB
webp(A + 'hero/santa-cruz-fachada-real.webp', 'assets/img/fotos/fachada-real.webp', 1400, 72)
webp(A + 'hero/santa-cruz-interior-real.webp', 'assets/img/fotos/interior-real.webp', 1400, 72)
webp(A + 'img/fotos/img22.webp', 'assets/img/fotos/lajeado-18x.webp', 1200, 72)
webp(A + 'img/fotos/fachada1.webp', 'assets/img/fotos/lajeado-esquina.webp', 1200, 72)
for l in LOJAS:
    for n in sorted({n for n, _ in l['fotos']} | {'fachada'}):
        webp(A + 'lojas/%s/%s.webp' % (l['pasta'], n), 'assets/lojas/%s/%s.webp' % (l['pasta'], n), 1400 if n == 'fachada' else 1100, 72)
for n in ['farroupilha/interior-3', 'farroupilha/interior-2', 'caxias-do-sul/interior-2', 'caxias-do-sul/interior-3', 'tramandai/interior-2', 'cachoeirinha/interior-2', 'lajeado/interior-1', 'capao-da-canoa/interior-2', 'cachoeira-do-sul/interior-2']:
    rel = 'assets/lojas/%s.webp' % n
    if rel not in DIM: webp(A + 'lojas/%s.webp' % n, rel, 1100, 74)
for i in range(1, 8):
    copia(A + 'img/banners/banner-%d-desktop-1280.webp' % i, 'assets/img/banners/banner-%d-desktop-1280.webp' % i)
    copia(A + 'img/banners/banner-%d-mobile.webp' % i, 'assets/img/banners/banner-%d-mobile.webp' % i)
for g in ['guia-melhor-camera-santa-cruz', 'guia-samsung-ou-motorola-caxias', 'guia-iphone-seminovo-farroupilha', 'guia-custo-beneficio-farroupilha', 'guia-o-que-analisar-bento', 'encontre-seu-celular']:
    webp(A + 'img/banners-lojas/%s.webp' % g, 'assets/img/banners-lojas/%s.webp' % g, 1280, 76)
for m in ['samsung', 'apple', 'xiaomi', 'motorola', 'realme', 'lg', 'itel', 'blu', 'infinix']: copia(A + 'img/marcas/%s.jpg' % m, 'assets/img/marcas/%s.jpg' % m)
E = REPO + 'Fotos HG/Fotos Eduardo/'
webp(E + 'CZ6_2442.jpg', 'assets/img/ceo/eduardo-1.webp', 1400, 74)
webp(E + 'CZ6_2488.jpg', 'assets/img/ceo/eduardo-2.webp', 1100, 76, corte=(0, 0, 1090, 1363))
webp(E + 'CZ6_2416.jpg', 'assets/img/ceo/eduardo-3.webp', 1400, 74)
webp(E + 'CZ6_2469.jpg', 'assets/img/ceo/eduardo-4.webp', 1400, 74)

# ───────── CSS, JS, bibliotecas ─────────
css = open(os.path.join(HERE, 'hg.css'), encoding='utf-8').read()
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
if MODO_REPO:
    fontes = ('@font-face{font-family:"Bebas Neue";font-weight:400;font-style:normal;font-display:swap;src:url(../fontes/BebasNeue-400.woff2) format("woff2")}\n'
              '@font-face{font-family:"Inter";font-weight:100 900;font-style:normal;font-display:swap;src:url(../fontes/Inter-variavel.woff2) format("woff2")}')
else:
    fontes = ('@font-face{font-family:"Bebas Neue";font-weight:400;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format("woff2")}\n'
              '@font-face{font-family:"Inter";font-weight:100 900;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format("woff2")}'
              % (b64(A + 'fontes/BebasNeue-400.woff2'), b64(A + 'fontes/Inter-variavel.woff2')))
assert '/*@@FONTES@@*/' in css
css_puro = len(css.encode())
grava('assets/css/hg.css', css.replace('/*@@FONTES@@*/', fontes))
lojas_js = [dict(id=l['id'], cidade=l['cidade'], tag=l['tag'], regiao=l['regiao'], end=l['end'], comp=l['comp'], sem=list(l['sem']), sab=list(l['sab']), dom=list(l['dom']) if l['dom'] else None,
                 zaps=l['zaps'], luz=l['luz'], url=base.url_loja(l), foto=base.foto_loja(l), rota=base.rota(l)) for l in LOJAS]
js = open(os.path.join(HERE, 'hg.js'), encoding='utf-8').read()
assert '/*@@LOJAS@@*/[]' in js
grava('assets/js/hg.js', js.replace('/*@@LOJAS@@*/[]', json.dumps(lojas_js, ensure_ascii=False, separators=(',', ':'))))
if not MODO_REPO:
    for v in ['gsap.min.js', 'ScrollTrigger.min.js', 'lenis.min.js']: shutil.copy(A + 'vendor/' + v, caminho('assets/vendor/' + v))

# ───────── mapa do RS (SVG embutido nas páginas que o usam) ─────────
svg = open(A + 'img/mapa-rs.svg', encoding='utf-8').read(); svg = svg[svg.index('<svg'):]
svg = re.sub(r'@media \(prefers-reduced-motion: no-preference\) \{.*?\n    \}\n', '', svg, flags=re.S)  # a animação própria sai: o GSAP assume
assert 'fincar' not in svg
svg = re.sub(r'<!--.*?-->', '', svg, flags=re.S); svg = re.sub(r'/\*.*?\*/', '', svg, flags=re.S); svg = re.sub(r'\n\s*\n+', '\n', svg)

# ───────── SEO herdado da página que já existe ─────────
ROBOTS = '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'
def seo_de(arq, titulo, desc):
    """Devolve (bloco de identidade, JSON-LD). Sem página anterior, monta um bloco novo no mesmo padrão do site."""
    p = REPO + arq
    if MODO_REPO and os.path.exists(p):
        velho = open(p, encoding='utf-8').read(); head = velho[velho.index('<head'):velho.index('</head>')]
        um = lambda rx: [re.sub(r'\s*\n\s*', ' ', m).strip() for m in re.findall(rx, head, flags=re.S)]
        partes = um(r'<title>.*?</title>')[:1] + um(r'<meta\s+name="description"[^>]*>')[:1] + um(r'<link\s+rel="canonical"[^>]*>')[:1] + um(r'<meta\s+name="robots"[^>]*>')[:1] + um(r'<meta\s+property="og:[^>]*>') + um(r'<meta\s+name="twitter:[^>]*>')
        ld = re.findall(r'(?:<!--(?:(?!-->).)*?-->\s*)?<script type="application/ld\+json">.*?</script>', head, flags=re.S)
        if partes and partes[0].startswith('<title>'): return '\n'.join(partes), '\n'.join(ld)
    if not MODO_REPO: return None, ''
    url = 'https://hgsmart.com.br/' + arq
    return '\n'.join(['<title>%s</title>' % esc(titulo), '<meta name="description" content="%s">' % esc(desc), '<link rel="canonical" href="%s">' % url, ROBOTS,
                      '<meta property="og:type" content="website">', '<meta property="og:site_name" content="Rede HG Smart">', '<meta property="og:locale" content="pt_BR">',
                      '<meta property="og:url" content="%s">' % url, '<meta property="og:title" content="%s">' % esc(titulo), '<meta property="og:description" content="%s">' % esc(desc),
                      '<meta property="og:image" content="https://hgsmart.com.br/assets/img/fotos/fachada1.jpg">', '<meta name="twitter:card" content="summary_large_image">']), ''

# ───────── páginas ─────────
def raiz(arq): return '../' * arq.count('/')
feitas = []
def escreve(res, inteiro=True, como=None):
    arq, titulo, desc, corpo, atual = res[:5]; loja = res[5] if len(res) > 5 else None
    arq = como or arq
    seo, ld = seo_de(arq, titulo, desc) if inteiro else (None, '')
    r = '/' if (MODO_REPO and arq == '404.html') else raiz(arq)   # a 404 é servida em qualquer profundidade: caminhos a partir da raiz
    grava(arq, documento(r, titulo, desc, corpo, atual, loja, inteiro, seo, ld)); feitas.append(arq)

h = P.p_home('', svg)
escreve(h, como=CFG['home'])
if not MODO_REPO: escreve(h, inteiro=False, como='index.html')   # no artifact, index.html é o miolo que o publicador embrulha
for f in [P.p_sobre, P.p_ceo, P.p_catalogo, P.p_acessorios, P.p_servicos, P.p_garantia, P.p_faq, P.p_contato, P.p_privacidade, P.p_termos, P.p_cookies, P2.p_como]:
    escreve(f(''))
escreve(P.p_404('/' if MODO_REPO else ''))
for i, p in enumerate(PAGAMENTOS): escreve(P2.p_pagamento('', p, i))
escreve(P2.p_lojas('../', svg))
for l in LOJAS: escreve(P2.p_loja('../../', l))

# ───────── sistema de design (só no repositório): tokens e página de referência saem do mesmo CSS e das mesmas peças ─────────
if MODO_REPO:
    import sistema
    from dados import FIG, VOZES, FAQ
    sistema.escreve_sistema(css, grava, base.im, FIG, LOJAS, PAGAMENTOS, VOZES, FAQ)
    feitas.append('design-system/index.html')

# ───────── conferência: toda referência local existe ─────────
faltas = []
for arq in feitas:
    s = open(os.path.join(OUT, arq), encoding='utf-8').read(); dirp = os.path.dirname(os.path.join(OUT, arq))
    s = re.sub(r'<script type="application/ld\+json">.*?</script>', '', s, flags=re.S)
    for m in re.finditer(r'(?:href|src|srcset)="([^"#?]+)(?:[#?][^"]*)?"', s):
        u = m.group(1)
        if re.match(r'^(https?:|mailto:|tel:|data:)', u): continue
        alvo = os.path.join(OUT, u.lstrip('/')) if u.startswith('/') else os.path.normpath(os.path.join(dirp, u))
        if not os.path.exists(alvo): faltas.append((arq, u))
if not MODO_REPO:
    json.dump(sorted([a for a in feitas if a != 'index.html'], key=lambda a: (a != CFG['home'], a.count('/'), a)), open(os.path.join(OUT, '..', 'paginas.json'), 'w'))
print('páginas:', len(feitas), '· arquivos escritos:', len(escritos), '· css sem fontes: %d KB' % (css_puro // 1024), '· hero: %d KB' % (os.path.getsize(os.path.join(OUT, 'assets/img/fotos/hero.webp')) // 1024))
print('FALTAS:', faltas[:20] if faltas else 'nenhuma')
if MODO_REPO: print('\n'.join(sorted(escritos)))
