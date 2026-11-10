# -*- coding: utf-8 -*-
"""Sistema de design: escreve design-system/tokens.css, tokens.json e index.html a partir do bloco :root de hg.css
e das mesmas peças que montam o site. Assim a referência nunca descreve um componente que o site não usa."""
import re, json
from base import *

# O que cada token é e onde entra. Token novo em hg.css sem nota aqui faz o gerador parar.
NOTAS = {
 '--fundo': ('cor', 'Fundo padrão da página e das seções.', None),
 '--fundo-2': ('cor', 'Seção alternada (.alt) e cartões sólidos.', None),
 '--fundo-3': ('cor', 'O ponto mais escuro: rodapé, faixa de números, menu, legendas sobre foto.', None),
 '--tinta': ('cor', 'Títulos e texto principal.', '20,0:1 sobre --fundo'),
 '--tinta-2': ('cor', 'Parágrafos e texto de apoio.', '11,5:1 sobre --fundo'),
 '--tinta-3': ('cor', 'Rótulos e metadados. Não usar abaixo de 11px.', '5,3:1 sobre --fundo'),
 '--acao': ('cor', 'O único acento: botão principal, foco, numerais, filete dos títulos. É acento, não superfície de seção.', '6,7:1 sobre --fundo'),
 '--acao-clara': ('cor', 'Hover do botão principal e links sobre fundo escuro.', '8,4:1 sobre --fundo'),
 '--acao-tinta': ('cor', 'Texto sobre --acao.', '5,5:1 sobre --acao'),
 '--acao-funda': ('cor', 'Só em degradê e brilho difuso (cartão ilustrado, avatar das avaliações). Não é cor de texto.', None),
 '--linha': ('cor', 'Borda de cartão e divisória.', None),
 '--linha-forte': ('cor', 'Borda de botão secundário, etiqueta e campo.', None),
 '--papel': ('cor', 'Fundo das seções claras (.clara).', None),
 '--papel-tinta': ('cor', 'Títulos e texto principal na seção clara.', '20,2:1 sobre --papel'),
 '--papel-tinta-2': ('cor', 'Parágrafos na seção clara.', '9,3:1 sobre --papel'),
 '--papel-tinta-3': ('cor', 'Rótulos na seção clara.', '4,7:1 sobre --papel'),
 '--papel-linha': ('cor', 'Divisórias na seção clara.', None),
 '--papel-acao': ('cor', 'Azul para texto pequeno e link na seção clara (--acao tem só 3,0:1 sobre branco).', '5,0:1 sobre --papel'),
 '--papel-acao-display': ('cor', 'Azul dos títulos grandes na seção clara. Só em corpo de 24px ou mais.', '3,8:1 sobre --papel'),
 '--ok': ('estado', 'Estado "aberta agora" e "disponível". Não entra na composição.', '10,0:1 sobre --fundo'),
 '--zap': ('estado', 'Botão de WhatsApp. É cor do canal, não da marca.', None),
 '--zap-tinta': ('estado', 'Texto sobre --zap.', '5,9:1 sobre --zap'),
 '--estrela': ('estado', 'Estrelas das avaliações do Google.', None),
 '--display': ('tipo', 'Bebas Neue 400. Títulos, numerais e nomes de cidade. Nunca com text-transform.', None),
 '--corpo': ('tipo', 'Inter variável. Todo o resto.', None),
 '--d1': ('tipo', 'Título da capa de cada página. Altura de linha .9.', None),
 '--d2': ('tipo', 'Título de capítulo. Altura de linha .92.', None),
 '--d3': ('tipo', 'Título de cartão e de bloco. Altura de linha 1.', None),
 '--d4': ('tipo', 'Título de item em lista densa: cidade, pergunta do FAQ, linha de tabela. Acréscimo deste redesenho à escala do DESIGN.md.', None),
 '--t1': ('tipo', 'Parágrafo de abertura, peso 300, até 58 caracteres por linha.', None),
 '--t2': ('tipo', 'Parágrafo padrão.', None),
 '--t3': ('tipo', 'Texto de cartão, botão e navegação.', None),
 '--r1': ('tipo', 'Rótulo: caixa alta em Inter, peso 600, espaçamento .16em.', None),
 '--dado': ('tipo', 'Numeral como ornamento ("18x", "01"): o dado em corpo grande.', None),
 '--dado-2': ('tipo', 'Numeral médio: números da rede e numeral dos cartões de forma de pagamento.', None),
 '--fantasma': ('tipo', 'Numeral vazado atrás do conteúdo, só contorno de 1px.', None),
 '--e-micro': ('movimento', 'Curva de hover e de troca de estado.', None),
 '--e-entrada': ('movimento', 'Curva de entrada de conteúdo.', None),
 '--micro': ('movimento', 'Duração de hover e de troca de estado.', None),
 '--entrada': ('movimento', 'Duração de entrada de conteúdo. Cenas maiores usam 900ms no GSAP.', None),
 '--secao': ('espaco', 'Respiro vertical de cada seção.', None),
 '--lado': ('espaco', 'Margem lateral do conteúdo. Nunca menor que 24px.', None),
 '--topo-h': ('espaco', 'Altura do cabeçalho fixo.', None),
}
ESCALA_ESPACO = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 12]
FORMA = [('Cartão', '1rem', 'Sólido em --fundo-2, borda de 1px em --linha. Sem sombra colorida, sem borda em degradê.'),
         ('Clicável', '999px', 'Botão, chip, etiqueta e filtro são pílula. Alvo mínimo de 44px.'),
         ('Campo', '.75rem', 'Entrada de formulário, borda em --linha-forte.'),
         ('Legenda', '.5rem', 'Legenda sobre foto, em --fundo-3 sólido. Nada de vidro sobre foto.')]
MOVIMENTO = ['O conteúdo está no HTML. Sem JavaScript, ou com movimento reduzido, a página inteira aparece parada e legível.',
             'Nada segura o visitante parado: não há seção presa. O aparelho das formas de pagamento fica ao lado enquanto os capítulos rolam, e no celular vira cartão.',
             'Só três animações de texto: máscara por linha (40ms entre linhas), fade com até 24px de deslocamento, e contagem uma vez por página.',
             'Anima-se transform e opacity. Recorte de imagem (clip-path) entra nas fotos; nada de largura, altura ou margem.',
             'Tudo que acompanha a rolagem usa inércia de .6. Animação fora da tela não roda.',
             'A abertura com contador aparece uma vez por sessão. Entre páginas, só a cortina.']

def tokens_de(css):
    bloco = css[css.index(':root{'):]; bloco = bloco[:bloco.index('\n}') + 2]
    pares = re.findall(r'(--[a-z0-9-]+)\s*:\s*([^;]+);', bloco)
    faltam = [n for n, _ in pares if n not in NOTAS]
    assert not faltam, 'token sem nota em sistema.py: %s' % faltam
    return bloco, pares

def escreve_sistema(css, grava, im, FIG, LOJAS, PAGAMENTOS, VOZES, FAQ):
    bloco, pares = tokens_de(css)
    V = dict(pares)
    # ── tokens.css
    props = '\n'.join('  %s: %s;' % (n, v.strip()) for n, v in pares)
    grava('design-system/tokens.css', '/* Rede HG Smart: tokens do site. Gerado de assets/css/hg.css por ferramentas/gerador-site; não edite à mão.\n   As regras de uso estão em README.md e no DESIGN.md da raiz. */\n:root {\n  color-scheme: dark;\n%s\n}\n' % props)
    # ── tokens.json
    grupos = {'cor': [], 'estado': [], 'tipo': [], 'movimento': [], 'espaco': []}
    for n, v in pares:
        g, uso, contraste = NOTAS[n]
        item = {'token': n, 'valor': v.strip(), 'uso': uso}
        if contraste: item['contraste'] = contraste
        grupos[g].append(item)
    grava('design-system/tokens.json', json.dumps({
        'nome': 'Rede HG Smart', 'fonte': 'assets/css/hg.css, bloco :root', 'regras': 'DESIGN.md',
        'cor': grupos['cor'], 'estado': grupos['estado'],
        'tipografia': {'familias': [{'nome': 'Bebas Neue', 'peso': '400', 'arquivo': 'assets/fontes/BebasNeue-400.woff2'}, {'nome': 'Inter', 'peso': '100 a 900 (variável)', 'arquivo': 'assets/fontes/Inter-variavel.woff2'}], 'escala': grupos['tipo']},
        'espaco': {'escala_rem': ESCALA_ESPACO, 'tokens': grupos['espaco'], 'grade': '12 colunas, vão de 1.5rem, largura máxima de 90rem'},
        'forma': [{'peca': a, 'raio': b, 'regra': c} for a, b, c in FORMA],
        'movimento': {'tokens': grupos['movimento'], 'regras': MOVIMENTO},
    }, ensure_ascii=False, indent=2) + '\n')

    # ── index.html: referência viva, com as peças reais do site
    r = '../'
    def cor(n):
        g, uso, ctr = NOTAS[n]
        return '<div class="cartao ds-cor"><i style="background:var(%s)"></i><div><code>%s</code><small>%s</small><span>%s</span>%s</div></div>' % (n, n, esc(V[n].strip()), uso, ('<small>%s</small>' % ctr) if ctr else '')
    escuras = ''.join(cor(n) for n in ['--fundo', '--fundo-2', '--fundo-3', '--tinta', '--tinta-2', '--tinta-3', '--acao', '--acao-clara', '--acao-tinta', '--acao-funda', '--linha', '--linha-forte'])
    claras = ''.join(cor(n) for n in ['--papel', '--papel-tinta', '--papel-tinta-2', '--papel-tinta-3', '--papel-linha', '--papel-acao', '--papel-acao-display'])
    estados = ''.join(cor(n) for n in ['--ok', '--zap', '--zap-tinta', '--estrela'])
    amostra = {'--d1': ('d1', 'Sem cartão,'), '--d2': ('d2', 'Seis caminhos'), '--d3': ('d3', 'Santa Cruz do Sul'), '--d4': ('', 'Como funciona a compra no boleto?')}
    tipo = ''
    for n in ['--d1', '--d2', '--d3', '--d4']:
        cls, txt = amostra[n]
        tipo += '<div><div class="ds-meta"><code>%s</code><small>%s</small><span>%s</span></div><p style="font-family:var(--display);font-size:var(%s);line-height:.94;letter-spacing:.01em">%s</p></div>' % (n, esc(V[n].strip()), NOTAS[n][1], n, txt)
    tipo += '<div><div class="ds-meta"><code>--t1</code><small>%s</small><span>%s</span></div><p class="t1">A simulação é presencial e sem compromisso: você descobre a condição real antes de decidir.</p></div>' % (esc(V['--t1'].strip()), NOTAS['--t1'][1])
    tipo += '<div><div class="ds-meta"><code>--t2</code><small>%s</small><span>%s</span></div><p class="t2">Mais de 5 financeiras analisam o seu caso, cada uma com critério próprio.</p></div>' % (esc(V['--t2'].strip()), NOTAS['--t2'][1])
    tipo += '<div><div class="ds-meta"><code>--t3</code><small>%s</small><span>%s</span></div><p class="t3">RG e CNH bastam para a simulação. Sem papelada extra.</p></div>' % (esc(V['--t3'].strip()), NOTAS['--t3'][1])
    tipo += '<div><div class="ds-meta"><code>--r1</code><small>%s</small><span>%s</span></div><p class="rotulo">Formas de pagamento</p></div>' % (esc(V['--r1'].strip()), NOTAS['--r1'][1])
    numerais = ''.join('<div><div class="ds-meta"><code>%s</code><small>%s</small><span>%s</span></div><p style="font-family:var(--display);font-size:min(var(%s),9rem);line-height:.8;%s">%s</p></div>' % (
        n, esc(V[n].strip()), NOTAS[n][1], n, est, txt) for n, txt, est in [('--dado', '18x', 'color:var(--acao)'), ('--dado-2', '24x', 'color:var(--acao)'), ('--fantasma', '01', 'color:transparent;-webkit-text-stroke:1px var(--linha-forte)')])
    esp = ''.join('<div><code>%srem</code><i style="width:%srem"></i></div>' % (('%g' % e).lstrip('0') if e < 1 else '%g' % e, e) for e in ESCALA_ESPACO)
    forma = ''.join('<div><dt>%s · %s</dt><dd>%s</dd></div>' % (a, b, c) for a, b, c in FORMA)
    l0, p0 = LOJAS[0], PAGAMENTOS[0]
    tela0 = tela(p0, 0, on=True).replace('<div class="t-ticks" data-n="%d" style="--c:%d"></div>' % p0['ticks'], '<div class="t-ticks" style="--c:%d">%s</div>' % (p0['ticks'][1], '<i></i>' * p0['ticks'][0]))
    def bloco_c(nome, classes, demo, largo=False):
        return '<div class="ds-bloco%s"><div class="ds-rot"><span class="rotulo">%s</span><code>%s</code></div>%s</div>' % (' largo' if largo else '', nome, classes, demo)
    comp = ''.join([
        bloco_c('Botões', '.btn .btn-p · .btn-s · .btn-zap · .btn-mini · .btn-t', '<div class="ds-palco">%s%s%s%s%s<a class="btn btn-s" aria-disabled="true">Indisponível</a></div><p class="t3">Um botão principal por tela. Hover sobe 2px; foco tem contorno de 2px em --acao.</p>' % (
            btn('#componentes', 'Encontre a loja mais próxima'), btn('#componentes', 'Conhecer a rede', 's'), btn('#componentes', 'Falar no WhatsApp', 'zap', ico=ICO['zap']), btn('#componentes', 'Ver a loja', 'p', cls='btn-mini'), link('#componentes', 'Como funciona')), largo=True),
        bloco_c('Capítulo e título em três tons', '.cap · .d2 · .ln · .vazado · .azul.grade', cap('01', 'Formas de pagamento') + tit(['Seis caminhos', 'para o mesmo', 'lugar.'], anima=False) + '<p class="t3">Número, rótulo e filete abrem o capítulo. O título usa branco cheio, vazado e azul, com o filete azul sob a última linha.</p>', largo=True),
        bloco_c('Chip, etiqueta e estado', '.chip · .etq · .status · .g-nota', '<div class="ds-palco"><a class="chip" href="#componentes">%s%s</a><span class="etq">%s</span><span class="etq nao">Pelotas · em breve</span><span class="status aberta"><span class="pulso aberta"></span><span>Aberta agora · fecha às %s</span></span><span class="status"><span class="pulso"></span><span>Fechada agora · abre amanhã às %s</span></span><span class="g-nota"><i aria-hidden="true">★</i><b>%s</b><span>no Google · %d avaliações</span></span></div>' % (
            ICO['zap'], l0['zaps'][0], l0['tag'], l0['sem'][1], l0['sem'][0], l0['google'][0], l0['google'][1])),
        bloco_c('Cartão', '.cartao.item · .item-n · .item-dado · .cartao.mini', '<div class="g2"><div class="cartao item"><span class="item-n">01</span><h3>Garantia oficial</h3><p class="t3">Trabalhamos com as principais marcas do mercado, sempre com procedência e garantia.</p>%s</div><div class="cartao item"><span class="item-dado" aria-hidden="true">%s</span><h3>%s</h3><p class="t3">%s</p></div></div>' % (
            link('#componentes', 'Ver garantia estendida'), p0['num'], p0['nome'], p0['resumo'])),
        bloco_c('Cartão de pendência', '.pend', pend(p0['pend'][0], p0['pend'][1]).replace(' data-r', '') + '<p class="t3">O que não se sabe não se publica: onde falta um dado, este cartão fica visível, com o código da pendência, em vez de um texto inventado.</p>'),
        bloco_c('Ficha', '.ficha', '<dl class="ficha">%s</dl>' % ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % (a, b) for a, b in p0['ficha'][2:5])),
        bloco_c('Disponibilidade', '.disp', '<div class="disp">%s</div>' % ''.join('<a href="#componentes"%s><b>%s</b><span>%s</span></a>' % ('' if l['luz'] else ' class="nao"', l['cidade'], 'Disponível' if l['luz'] else 'Não disponível') for l in LOJAS[2:5])),
        bloco_c('Horário e WhatsApp da loja', '.horas · .zaps', horas(l0) + zaps(l0)),
        bloco_c('Avaliação', '.dep', '<div class="dep-g">%s</div>' % dep(VOZES[3])),
        bloco_c('Pergunta', '.faq-i · .faq-b · .faq-p', '<div class="faq-l">%s</div>' % faq_itens(FAQ[4:6], r, 'ds')),
        bloco_c('Etapas com trilho', '.etapas · .trilho · .etapa', '<ol class="etapas"><span class="trilho" aria-hidden="true"><i></i></span><li class="etapa on"><span class="etapa-n" aria-hidden="true">01</span><h3>Escolha o aparelho</h3><p class="t3">O estado do produto é declarado antes da compra.</p></li><li class="etapa on"><span class="etapa-n" aria-hidden="true">02</span><h3>Simulação presencial</h3><p class="t3">Leva poucos minutos e não tem compromisso.</p></li></ol>'),
        bloco_c('Aparelho das formas de pagamento', '.cel · .tela · .t-num · .t-ticks · .t-w', '<div class="cel-solo" aria-hidden="true" style="--ch:30rem">%s</div><p class="t3">Um traço por parcela. No celular o aparelho some e a figura da forma entra no cartão.</p>' % aparelho(tela0)),
    ])
    mov = ''.join('<li><span>%s</span></li>' % m for m in MOVIMENTO)
    mov_t = ''.join('<div><dt>%s</dt><dd><strong>%s</strong><br>%s</dd></div>' % (n, esc(V[n].strip()), NOTAS[n][1]) for n in ['--micro', '--entrada', '--e-micro', '--e-entrada'])
    pagina = f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Sistema de design · Rede HG Smart</title>
<meta name="description" content="Tokens, tipografia, componentes e regras de movimento do site da Rede HG Smart.">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#07080a">
<link rel="icon" href="{r}assets/img/icones/FAVICON.png">
<link rel="stylesheet" href="{r}assets/css/hg.css">
<style>
/* estilos só desta página de referência; os componentes vêm de hg.css */
.ds-topo{{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;flex-wrap:wrap;padding-block:1.5rem;border-bottom:1px solid var(--linha)}}
.ds-topo img{{height:2rem;width:auto}}
.ds-topo nav{{display:flex;gap:1.5rem;flex-wrap:wrap;font-size:var(--t3);color:var(--tinta-2)}}
.ds-topo nav a:hover{{color:var(--tinta)}}
.capa{{padding-top:clamp(3rem,9vh,6rem)}}
code{{font-family:var(--corpo);font-size:var(--t3);font-weight:600;color:var(--tinta);overflow-wrap:anywhere}}
.clara code{{color:var(--papel-tinta)}}
.ds-cores{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(15rem,100%),1fr));gap:1.5rem}}
.ds-cor{{overflow:hidden}}
.ds-cor i{{display:block;height:6rem;border-bottom:1px solid var(--linha)}}
.ds-cor div{{display:flex;flex-direction:column;gap:.25rem;padding:1rem}}
.ds-cor span{{font-size:var(--t3);line-height:1.5;color:var(--tinta-2)}}
.ds-cor small,.ds-meta small{{font-size:var(--r1);letter-spacing:.04em;color:var(--tinta-3);font-variant-numeric:tabular-nums;overflow-wrap:anywhere}}
.ds-sub{{margin:3rem 0 1.5rem}}
.ds-tipo>div{{display:grid;grid-template-columns:minmax(0,1fr);gap:.75rem;padding-block:1.5rem;border-top:1px solid var(--linha);align-items:baseline}}
.ds-tipo>div>*{{min-width:0}}
.ds-meta{{display:flex;flex-direction:column;gap:.25rem}}
.ds-meta span{{font-size:var(--t3);line-height:1.5;color:var(--tinta-2)}}
@media(min-width:860px){{.ds-tipo>div{{grid-template-columns:16rem minmax(0,1fr);gap:3rem}}}}
.ds-esp{{display:flex;flex-direction:column;gap:.75rem}}
.ds-esp div{{display:grid;grid-template-columns:4rem minmax(0,1fr);align-items:center;gap:1rem}}
.ds-esp i{{display:block;height:.75rem;max-width:100%;border-radius:999px;background:var(--acao)}}
.ds-comp{{display:grid;grid-template-columns:minmax(0,1fr);gap:1.5rem}}
@media(min-width:960px){{.ds-comp{{grid-template-columns:repeat(2,minmax(0,1fr))}}.ds-bloco.largo{{grid-column:1/-1}}}}
.ds-bloco{{display:flex;flex-direction:column;gap:1.5rem;min-width:0;padding:1.5rem;border-radius:1rem;border:1px solid var(--linha)}}
.ds-rot{{display:flex;flex-direction:column;gap:.25rem;padding-bottom:1rem;border-bottom:1px solid var(--linha)}}
.ds-rot code{{color:var(--acao-clara);font-weight:500}}
.ds-palco{{display:flex;flex-wrap:wrap;gap:1rem;align-items:center}}
.ds-bloco .cel-solo{{padding-block:0}}
.ds-bloco .faq-i:first-child .faq-p{{grid-template-rows:1fr}}
.ds-bloco .faq-i:first-child .faq-p>div{{visibility:visible}}
</style>
</head>
<body>
<div class="pagina">
<header class="wrap ds-topo">
  <a href="{r}index.html" aria-label="Voltar ao site"><img src="{r}assets/img/icones/logo-400.png" alt="HG Smart" width="400" height="204"></a>
  <nav aria-label="Seções"><a href="#cor">Cor</a><a href="#tipografia">Tipografia</a><a href="#espaco">Espaço e forma</a><a href="#componentes">Componentes</a><a href="#movimento">Movimento</a></nav>
</header>
<main id="conteudo">
<section class="capa"><div class="wrap capa-g so"><div class="capa-txt">
  {cap('', 'Sistema de design · Rede HG Smart')}
  {tit(['Preto profundo,', 'um único azul,', 'títulos condensados.'], 'cva', 'h1', 'd1', anima=False)}
  <p class="t1">A referência do site: tokens, tipografia, componentes e regras de movimento. As peças desta página são as mesmas que montam o site e carregam a mesma folha, <code>assets/css/hg.css</code>. As regras vêm do <code>DESIGN.md</code>, na raiz do repositório.</p>
</div></div></section>

<section class="sec" id="cor"><div class="wrap">
  {cab('01', 'Cor', ['Token com nome', 'de função,', 'não de cor.'], sub='O azul é acento, não superfície de seção. Vermelho, verde e amarelo só existem como estado de sistema.').replace(' data-r', '').replace(' data-linhas', '')}
  <div class="ds-cores">{escuras}</div>
  <h3 class="d3 ds-sub">Seção clara</h3>
  <div class="ds-cores">{claras}</div>
  <h3 class="d3 ds-sub">Estados de sistema</h3>
  <div class="ds-cores">{estados}</div>
</div></section>

<section class="sec alt" id="tipografia"><div class="wrap">
  {cab('02', 'Tipografia', ['Duas famílias,', 'uma escala', 'fechada.'], sub='Bebas Neue nos títulos, Inter no resto. Bebas nunca recebe text-transform: a caixa alta é da própria fonte. Valor fora da escala não entra.').replace(' data-r', '').replace(' data-linhas', '')}
  <div class="ds-tipo">{tipo}</div>
  <h3 class="d3 ds-sub">O dado é o ornamento</h3>
  <div class="ds-tipo">{numerais}</div>
</div></section>

<section class="sec" id="espaco"><div class="wrap">
  {cab('03', 'Espaço e forma', ['Onze passos', 'de espaço,', 'quatro raios.'], sub='Grade de 12 colunas com vão de 1.5rem e largura máxima de 90rem. O respiro de seção é --secao e a margem lateral é --lado.').replace(' data-r', '').replace(' data-linhas', '')}
  <div class="g2"><div class="ds-esp">{esp}</div><dl class="ficha">{forma}</dl></div>
</div></section>

<section class="sec alt" id="componentes"><div class="wrap">
  {cab('04', 'Componentes', ['As peças', 'que montam', 'o site.'], sub='Cada bloco mostra a peça com conteúdo real do site e as classes que a formam.').replace(' data-r', '').replace(' data-linhas', '')}
  <div class="ds-comp">{comp}</div>
</div></section>

<section class="sec clara"><div class="wrap">
  {cab('', 'Na seção clara', ['As mesmas peças', 'sobre', 'papel.'], sub='A seção clara troca a tinta e usa o azul mais escuro para manter o contraste.').replace(' data-r', '').replace(' data-linhas', '')}
  <div class="ds-palco">{btn('#componentes', 'Simular na loja mais perto')}{btn('#componentes', 'Comparar as seis', 's')}{link('#componentes', 'Ver as unidades')}</div>
  <div style="margin-top:3rem">{pend('', 'O cartão de pendência também existe na seção clara.', 'Conteúdo pendente').replace(' data-r', '')}</div>
</div></section>

<section class="sec" id="movimento"><div class="wrap">
  {cab('05', 'Movimento', ['Movimento que', 'acompanha,', 'não segura.'], sub='Um orquestrador de rolagem (GSAP com ScrollTrigger) e uma rolagem suave (Lenis). Com prefers-reduced-motion nada disso liga.').replace(' data-r', '').replace(' data-linhas', '')}
  <div class="g2"><ul class="lista-p">{mov}</ul><dl class="ficha">{mov_t}</dl></div>
</div></section>
</main>
<footer class="rodape"><div class="wrap rodape-b" style="border-top:0;padding-block:1.5rem"><span>Sistema de design da Rede HG Smart · gerado de assets/css/hg.css</span><span><a href="{r}index.html">Voltar ao site</a></span></div></footer>
</div>
</body>
</html>
'''
    grava('design-system/index.html', pagina)
