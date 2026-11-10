# -*- coding: utf-8 -*-
"""Peças compartilhadas: cabeçalho, menu, rodapé, títulos em três tons, cartões."""
import html as _html, urllib.parse as up
from dados import *

CFG = dict(artefato=True, home='inicio.html')

def esc(s): return _html.escape(str(s), quote=True)

ICO = dict(
 zap='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 1-13.4 7.8L3 21l1.2-4.6A9 9 0 1 1 21 12z"/></svg>',
 seta='<svg class="seta" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 esq='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
 dir='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 pin='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
 insta='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>',
)

def wa(num, txt=None):
    u = 'https://wa.me/55' + ''.join(c for c in num if c.isdigit())
    return u + ('?text=' + up.quote(txt) if txt else '')

def rota(l):
    if l.get('geo'): return 'https://www.google.com/maps/dir/?api=1&destination=%s,%s' % l['geo']
    return 'https://www.google.com/maps/dir/?api=1&destination=' + up.quote('%s, %s, RS' % (l['end'].split(' · ')[0], l['cidade']))

def url_loja(l): return 'lojas/%s/index.html' % l['id']
def foto_loja(l, nome='fachada'): return 'assets/lojas/%s/%s.webp' % (l['pasta'], nome)
ZAP_REDE = wa(REDE['fones'][0], 'Olá! Vim pelo site da HG Smart e gostaria de saber mais sobre as condições de pagamento.')

# ───────── tipografia ─────────
def tit(linhas, tons='cva', tag='h2', cls='d2', grade=True, anima=True):
    out = []
    for i, l in enumerate(linhas):
        t = tons[i] if i < len(tons) else 'c'
        ult = grade and i == len(linhas) - 1 and t == 'a'
        c = {'c': '', 'v': ' class="vazado"', 'a': ' class="azul grade"' if ult else ' class="azul"'}[t]
        out.append('<span class="ln"><span%s>%s%s</span></span>' % (c, l, '<i></i>' if ult else ''))
    return '<%s class="%s"%s>%s</%s>' % (tag, cls, ' data-linhas' if anima else '', ''.join(out), tag)

def cap(n, rot):
    b = '<b>%s</b>' % n if n else ''
    return '<div class="cap" data-r>%s<span class="rotulo">%s</span><i></i></div>' % (b, rot)

def cab(n, rot, linhas, tons='cva', sub=None, tag='h2', cls='d2', extra=''):
    h = cap(n, rot) + tit(linhas, tons, tag, cls)
    if sub: h += '<p class="t1 degrau" data-r>%s</p>' % sub
    return '<div class="cab">%s%s</div>' % (h, extra)

def btn(href, txt, tipo='p', ext=False, cls='', ico=''):
    a = ' target="_blank" rel="noopener"' if ext else ''
    return '<a class="btn btn-%s%s" href="%s"%s>%s%s</a>' % (tipo, (' ' + cls) if cls else '', href, a, ico, txt)

def link(href, txt, ext=False):
    a = ' target="_blank" rel="noopener"' if ext else ''
    return '<a class="btn-t" href="%s"%s>%s%s</a>' % (href, a, txt, ICO['seta'])

def pend(cod, corpo, titulo='Conteúdo pendente'):
    if isinstance(corpo, (list, tuple)): c = '<ul>%s</ul>' % ''.join('<li><span>%s</span></li>' % x for x in corpo)
    else: c = '<p>%s</p>' % corpo
    return '<aside class="pend" data-r data-pendencia="%s"><span class="rotulo">%s%s</span>%s</aside>' % (cod, titulo, (' · ' + cod) if cod else '', c)

def img(r, src, alt, w, h, lazy=True, cls=''):
    return '<img src="%s%s" alt="%s" width="%d" height="%d"%s%s decoding="async">' % (r, src, esc(alt), w, h, ' loading="lazy"' if lazy is True else (' fetchpriority="high"' if lazy is False else ''), (' class="%s"' % cls) if cls else '')

# ───────── aparelho ─────────
def tela(p, i, total=6, on=False):
    ticks = '<div class="t-ticks" data-n="%d" style="--c:%d"></div>' % p['ticks'] if p['ticks'] else ''
    return ('<div class="tela%s%s"><div class="t-topo"><b>HG <em>Smart</em></b><span>%02d / %02d</span></div>'
            '<div class="t-num%s">%s</div><div class="t-nome">%s</div>%s<div class="t-leg">%s</div>%s'
            '<div class="t-chips">%s</div><div class="t-cta">%s</div></div>') % (
        ' azulada' if p['azulada'] else '', ' on' if on else '', i + 1, total,
        ' menor' if len(p['num']) > 3 else '', p['num'], p['nome_tela'], ticks, p['leg'], FIG[p['id']],
        ''.join('<span>%s</span>' % c for c in p['chips']), p['cta_tela'])

def aparelho(telas_html):
    return '<div class="cel-3d"><div class="cel"><div class="cel-tela">%s</div></div></div>' % telas_html

# ───────── cabeçalho, menu, rodapé ─────────
NAV = [('como-comprar.html', 'Formas de pagamento', 'pagar'), ('catalogo.html', 'Smartphones', 'smart'), ('acessorios.html', 'Acessórios', 'acess'),
       ('lojas/index.html', 'Lojas', 'lojas'), ('garantia.html', 'Garantia', 'garantia'), ('quem-somos.html', 'A HG Smart', 'sobre')]
MENU = [('@home', 'Início', 'home'), ('catalogo.html', 'Smartphones', 'smart'), ('como-comprar.html', 'Formas de pagamento', 'pagar'), ('acessorios.html', 'Acessórios', 'acess'),
        ('lojas/index.html', 'Nossas lojas', 'lojas'), ('garantia.html', 'Garantia estendida', 'garantia'), ('quem-somos.html', 'Sobre a HG Smart', 'sobre'),
        ('ceo.html', 'Conheça o CEO', 'ceo'), ('servicos.html', 'Serviços', 'servicos'), ('faq.html', 'FAQ', 'faq'), ('contato.html', 'Contato', 'contato')]

def _h(r, href): return r + (CFG['home'] if href == '@home' else href)
def home(r): return r + CFG['home']

def cabecalho(r, atual):
    nav = ''.join('<a href="%s"%s>%s</a>' % (_h(r, h), ' aria-current="page"' if k == atual else '', t) for h, t, k in NAV)
    pri = ''.join('<li><a href="%s"%s><small>%02d</small>%s</a></li>' % (_h(r, h), ' aria-current="page"' if k == atual else '', i + 1, t) for i, (h, t, k) in enumerate(MENU))
    pgs = ''.join('<li><a href="%s%s.html"><b>%s</b><span>%s</span></a></li>' % (r, p['id'], p['num'], p['nome']) for p in PAGAMENTOS)
    ljs = ''.join('<li><a href="%s%s"><span>%s</span><span class="pulso" data-pulso="%s"></span></a></li>' % (r, url_loja(l), l['cidade'], l['id']) for l in LOJAS)
    return f'''<div class="intro" aria-hidden="true"><div class="intro-col"></div><div class="intro-col"></div><div class="intro-col"></div><div class="intro-col"></div><div class="intro-col"></div><div class="intro-centro"><div class="intro-miolo"><img src="{r}assets/img/icones/logo-400.png" alt="" width="400" height="204"><div class="intro-barra"><i></i></div></div></div><span class="intro-num">00</span></div>
<div class="cursor" aria-hidden="true"></div>
<div class="progresso" aria-hidden="true"></div>
<a class="pular" href="#conteudo">Ir para o conteúdo</a>
<header class="topo">
  <div class="wrap topo-in">
    <a class="topo-logo" href="{home(r)}" aria-label="Rede HG Smart, página inicial"><img src="{r}assets/img/icones/logo-400.png" alt="HG Smart" width="400" height="204"></a>
    <nav class="topo-nav" aria-label="Principal">{nav}</nav>
    <div class="topo-dir">
      <a class="btn btn-p btn-mini" href="{r}lojas/index.html">Encontre a loja</a>
      <button class="menu-b" type="button" aria-expanded="false" aria-controls="menu"><i aria-hidden="true"></i><span>Menu</span></button>
    </div>
  </div>
</header>
<div class="menu" id="menu" aria-hidden="true" aria-label="Mapa do site">
  <div class="wrap menu-in">
    <nav class="menu-col menu-pri" aria-label="Todas as páginas"><ul>{pri}</ul></nav>
    <div class="menu-col"><span class="rotulo">Formas de pagamento</span><ul class="menu-lista">{pgs}</ul></div>
    <div class="menu-col"><span class="rotulo">Lojas · <span data-abertas>10</span> abertas agora</span><ul class="menu-lista">{ljs}</ul></div>
  </div>
</div>'''

def rodape(r, loja=None):
    inst = [('@home', 'Início'), ('quem-somos.html', 'Sobre a HG Smart'), ('ceo.html', 'Conheça o CEO'), ('servicos.html', 'Serviços'), ('catalogo.html', 'Smartphones'),
            ('acessorios.html', 'Acessórios'), ('garantia.html', 'Garantia estendida'), ('faq.html', 'FAQ'), ('contato.html', 'Contato')]
    c_inst = ''.join('<a href="%s">%s</a>' % (_h(r, h), t) for h, t in inst)
    c_pg = '<a href="%scomo-comprar.html">Como comprar</a>' % r + ''.join('<a href="%s%s.html">%s</a>' % (r, p['id'], p['nome']) for p in PAGAMENTOS)
    c_lj = ''.join('<a href="%s%s">%s</a>' % (r, url_loja(l), l['cidade']) for l in LOJAS)
    fones = ''.join('<span class="tel">%s</span>' % f for f in REDE['fones'])
    if loja:
        z = wa(loja['zaps'][0], 'Olá! Vim pelo site da HG Smart e quero falar com a loja de %s.' % loja['cidade'])
        barra = '<a class="btn btn-zap" href="%s" target="_blank" rel="noopener">%sWhatsApp da loja</a><a class="btn btn-s" href="%s" target="_blank" rel="noopener">Traçar rota</a>' % (z, ICO['zap'], rota(loja))
        zap = '<a class="zap" href="%s" target="_blank" rel="noopener">%sFalar com %s</a>' % (z, ICO['zap'], loja['cidade'])
    else:
        barra = '<a class="btn btn-zap" href="%s" target="_blank" rel="noopener">%sWhatsApp</a><a class="btn btn-s" href="%slojas/index.html">Lojas</a>' % (ZAP_REDE, ICO['zap'], r)
        zap = '<a class="zap" href="%s" target="_blank" rel="noopener">%sFalar no WhatsApp</a>' % (ZAP_REDE, ICO['zap'])
    return f'''<footer class="rodape">
  <div class="wrap rodape-g">
    <div><img src="{r}assets/img/icones/logo-400.png" alt="HG Smart" width="400" height="204" loading="lazy"><span>Rede de lojas de celulares no Rio Grande do Sul. Tecnologia acessível, garantia oficial e condições reais.</span>
      <a href="{REDE['insta']}" target="_blank" rel="noopener">Instagram</a><a href="{REDE['face']}" target="_blank" rel="noopener">Facebook</a><a href="{REDE['tiktok']}" target="_blank" rel="noopener">TikTok</a><a href="{REDE['youtube']}" target="_blank" rel="noopener">YouTube</a><a href="{REDE['blog']}" target="_blank" rel="noopener">Blog</a></div>
    <div><span class="rotulo">Institucional</span>{c_inst}</div>
    <div><span class="rotulo">Formas de pagamento</span>{c_pg}</div>
    <div><span class="rotulo">Nossas unidades</span>{c_lj}<a href="{r}lojas/index.html">Todas as lojas</a></div>
    <div><span class="rotulo">Contato</span>{fones}<span class="tel">{REDE['email']}</span><a href="{r}contato.html">Todos os canais</a>
      <span class="rotulo" style="margin-top:1rem">Matriz</span><span>{REDE['razao']}</span><span>CNPJ {REDE['cnpj']}</span><span>{REDE['matriz'][0]} · {REDE['matriz'][1]}<br>{REDE['matriz'][2]} · {REDE['matriz'][3]}</span></div>
  </div>
  <div class="wrap"><div class="rodape-marca" aria-hidden="true">Rede HG Smart</div></div>
  <div class="wrap rodape-b"><span>© 2026 {REDE['razao']} · CNPJ {REDE['cnpj']}</span><span><a href="{r}politica-de-privacidade.html">Política de Privacidade</a><a href="{r}termos-de-uso.html">Termos de Uso</a><a href="{r}politica-de-cookies.html">Política de Cookies</a></span></div>
</footer>
{zap}
<div class="barra">{barra}</div>'''

CABECA_JS = "(function(){var d=document.documentElement;try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion-ok');var v=null;try{v=sessionStorage.getItem('hg-visto')}catch(e){}if(!v)d.classList.add('estreia')}}catch(e){}setTimeout(function(){if(!window.__hg)d.classList.remove('motion-ok','estreia')},3500)})();"

def scripts(r):
    if CFG['artefato']:
        return (f'<script src="{r}assets/vendor/gsap.min.js"></script>\n'
                '<script>window.gsap||document.write(\'<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\\/script>\')</script>\n'
                f'<script src="{r}assets/vendor/ScrollTrigger.min.js"></script>\n'
                '<script>window.ScrollTrigger||document.write(\'<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\\/script>\')</script>\n'
                f'<script src="{r}assets/vendor/lenis.min.js"></script>\n<script src="{r}assets/js/hg.js"></script>')
    return (f'<script src="{r}assets/vendor/gsap.min.js" defer></script>\n<script src="{r}assets/vendor/ScrollTrigger.min.js" defer></script>\n'
            f'<script src="{r}assets/vendor/lenis.min.js" defer></script>\n<script src="{r}assets/js/hg.js" defer></script>')

def documento(r, titulo, desc, corpo, atual, loja=None, inteiro=True, seo=None, ld=''):
    """inteiro=False devolve só o miolo, como o publicador de artifact espera (ele embrulha em doctype/head/body).
    seo: bloco de <title>, descrição, canonical, robots e Open Graph herdado da página que já estava publicada; ld: os JSON-LD dela."""
    miolo = f'''<div class="pagina" data-raiz="{r}"{(' data-loja="%s"' % loja['id']) if loja else ''}>
{cabecalho(r, atual)}
<main id="conteudo">
{corpo}
</main>
{rodape(r, loja)}
</div>
{scripts(r)}'''
    identidade = seo if seo else f'''<title>{esc(titulo)}</title>
<meta name="description" content="{esc(desc)}">'''
    pre = '' if CFG['artefato'] else f'''<link rel="preload" href="{r}assets/fontes/BebasNeue-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{r}assets/fontes/Inter-variavel.woff2" as="font" type="font/woff2" crossorigin>
'''
    cabeca = f'''{identidade}
<meta name="theme-color" content="#07080a">
<script>{CABECA_JS}</script>
{pre}<link rel="stylesheet" href="{r}assets/css/hg.css">{(chr(10) + ld) if ld else ''}'''
    if not inteiro:
        return cabeca.replace('</title>', '</title>\n<meta name="claude:viewport-fit-sides" content="cover">', 1) + '\n' + miolo
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<link rel="icon" href="{r}assets/img/icones/FAVICON.png">
{cabeca}
</head>
<body>
{miolo}
</body>
</html>'''

# ───────── blocos repetidos ─────────
def capa(r, migalha, rot, linhas, lead, tons='cva', lado='', acoes='', extra='', so=False, orn=None):
    mig = '<nav class="migalhas" aria-label="Você está em" data-r><a href="%s">Início</a><span>/</span>%s</nav>' % (home(r), migalha)
    return f'''<section class="capa">
  <div class="wrap capa-g{' so' if so or not lado else ''}">
    <div class="capa-txt">{mig}{cap('', rot)}{tit(linhas, tons, 'h1', 'd1')}{('<p class="t1" data-r>%s</p>' % lead) if lead else ''}{('<div class="acoes" data-r>%s</div>' % acoes) if acoes else ''}{extra}</div>
    {('<div class="capa-lado%s">%s</div>' % (' orn' if (orn or (orn is None and 'capa-dado' in lado)) else '', lado)) if lado else ''}
  </div>
</section>'''

def chamada(r, linhas, sub, acoes):
    return f'''<section class="cta">
  <div class="wrap cta-in">
    <h2 class="d1">{''.join('<span class="enche">%s</span>' % l for l in linhas)}</h2>
    <p class="t1" data-r>{sub}</p>
    <div class="acoes" data-r>{acoes}</div>
  </div>
</section>'''

def faq_itens(itens, r, pid='faq', abre=0, grupos=False, pendencias=False):
    out, g = [], None
    for i, f in enumerate(itens):
        if grupos and f['g'] != g:
            g = f['g']; out.append('<div class="faq-grupo">%s</div>' % g)
        mais = '<p>%s</p>' % link(r + f['mais'][0], f['mais'][1]) if f.get('mais') else ''
        pd = ('<aside class="pend" data-pendencia><span class="rotulo">Pendente</span><p>%s</p></aside>' % f['pend']) if (pendencias and f.get('pend')) else ''
        on = i == abre
        out.append(f'''<div class="faq-i{' aberto' if on else ''}"><button class="faq-b" type="button" aria-expanded="{'true' if on else 'false'}" aria-controls="{pid}{i}" id="{pid}b{i}">{f['q']}<i aria-hidden="true"></i></button><div class="faq-p" id="{pid}{i}" role="region" aria-labelledby="{pid}b{i}"><div><div class="faq-r"><p>{f['r']}</p>{mais}{pd}</div></div></div></div>''')
    return ''.join(out)

def dep(v, google=True):
    nome, meta, quando, txt = v
    return ('<figure class="dep"><div class="dep-q"><i>%s</i><div><strong>%s</strong><span>%s</span></div></div><div class="dep-e">★★★★★<small>%s</small></div>'
            '<blockquote>%s</blockquote><figcaption>Avaliação publicada no Google</figcaption></figure>') % (esc(nome[0].upper()), esc(nome), esc(meta), esc(quando), esc(txt))

def horas(l):
    return ('<dl class="horas"><div><dt>Seg a sex</dt><dd>%s – %s</dd></div><div><dt>Sábado</dt><dd>%s – %s</dd></div><div><dt>Domingo</dt><dd>%s</dd></div></dl>'
            % (l['sem'][0], l['sem'][1], l['sab'][0], l['sab'][1], ('%s – %s' % l['dom']) if l['dom'] else 'Fechada'))

def zaps(l):
    return '<div class="zaps">%s</div>' % ''.join('<a class="chip" href="%s" target="_blank" rel="noopener">%s%s</a>' % (wa(z), ICO['zap'], z) for z in l['zaps'])

def outras_formas(r, atual_id):
    cs = ''.join(f'''<a class="cartao item" href="{r}{p['id']}.html" data-r><span class="item-dado" aria-hidden="true">{p['num']}</span><h3>{p['nome']}</h3><p class="t3">{p['resumo']}</p><span class="btn-t">Como funciona{ICO['seta']}</span></a>''' for p in PAGAMENTOS if p['id'] != atual_id)
    return cs

def modulo_lojas(r, mapa_svg):
    lis = ''.join('<li><a href="%s%s" data-id="%s"><span class="n">%02d</span><span class="c">%s</span><span class="pulso" data-pulso="%s"></span></a></li>' % (r, url_loja(l), l['id'], i + 1, l['cidade'], l['id']) for i, l in enumerate(LOJAS))
    l0 = LOJAS[0]
    return f'''<div class="lj-g">
      <ul class="lj-lista" id="ljLista" aria-label="Cidades com loja">{lis}</ul>
      <div class="lj-meio">
        <div class="lj-mapa" id="ljMapa"><div class="lj-mapa-3d">{mapa_svg}</div></div>
        <div class="lj-leg"><span><i></i>Cidade com loja</span><span><i class="breve"></i>Pelotas, em breve</span><span><i class="ab"></i>Aberta agora</span></div>
      </div>
      <article class="lj-card cartao" id="ljCard" aria-live="polite">
        <div class="lj-foto"><img id="ljFoto" src="{r}{foto_loja(l0)}" alt="Loja HG Smart de {l0['cidade']}" width="900" height="600" loading="lazy"></div>
        <div class="lj-corpo">
          <div class="lj-tit"><h3 id="ljCidade">{l0['cidade']}</h3><span class="rotulo" id="ljTag">{l0['tag']}</span></div>
          <p class="status" id="ljStatus" data-status="{l0['id']}"><span class="pulso"></span><span>Seg a sex {l0['sem'][0]} – {l0['sem'][1]}</span></p>
          <p class="lj-end" id="ljEnd">{l0['end']}<br><span>{l0['comp']}</span></p>
          <dl class="horas" id="ljHoras"><div><dt>Seg a sex</dt><dd>{l0['sem'][0]} – {l0['sem'][1]}</dd></div><div><dt>Sábado</dt><dd>{l0['sab'][0]} – {l0['sab'][1]}</dd></div><div><dt>Domingo</dt><dd>Fechada</dd></div></dl>
          <div class="zaps" id="ljZaps"></div>
          <p class="nota" id="ljNota" hidden></p>
          <div class="lj-acoes"><a class="btn btn-zap btn-mini" id="ljZapBtn" href="{wa(l0['zaps'][0])}" target="_blank" rel="noopener">{ICO['zap']}WhatsApp</a><a class="btn btn-s btn-mini" id="ljRota" href="{rota(l0)}" target="_blank" rel="noopener">Como chegar</a><a class="btn-t" id="ljPag" href="{r}{url_loja(l0)}">Ver a loja{ICO['seta']}</a></div>
        </div>
      </article>
    </div>'''

# ───────── imagens com dimensão declarada (CLS) ─────────
DIM = {}
def im(r, src, alt='', lazy=True, cls=''):
    w, h = DIM.get(src, (1200, 800))
    return img(r, src, alt, w, h, lazy, cls)

def foto(r, src, alt, razao='r43', leg=None, clip=True, lazy=True, extra=''):
    return '<figure class="foto %s"%s%s>%s%s</figure>' % (razao, ' data-clip' if clip else '', extra, im(r, src, alt, lazy), ('<figcaption>%s</figcaption>' % leg) if leg else '')
