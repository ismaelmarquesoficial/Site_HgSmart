# -*- coding: utf-8 -*-
"""Páginas: como comprar, as seis formas de pagamento, lojas e as dez unidades."""
from base import *

ANTES = [('Documento', 'RG e CNH bastam para a simulação. Sem papelada extra.'), ('Sem cartão', 'Não precisa de cartão de crédito nem de conta em banco para o boleto.'),
         ('Se tiver, melhor', 'Quem tem limite no cartão fecha em até 10x sem juros, ou até 18x parcelado.')]
def _antes():
    return ''.join(f'<div class="cartao item" data-r><span class="item-n">{i + 1:02d}</span><h3>{t}</h3><p class="t3">{x}</p></div>' for i, (t, x) in enumerate(ANTES))

# ═════════════════════════ COMO COMPRAR ═════════════════════════
def p_como(r):
    cards = ''.join(f'''<a class="cartao item" href="{r}{p['id']}.html" data-r><span class="item-n">{i + 1:02d} · {p['rot']}</span><span class="item-dado" aria-hidden="true">{p['num']}</span><h3>{p['nome']}</h3><p class="t3">{p['resumo']}</p><span class="btn-t">Como funciona{ICO['seta']}</span></a>''' for i, p in enumerate(PAGAMENTOS))
    linhas = ''.join(f'''<tr><th scope="row"><a href="{r}{p['id']}.html"><b>{p['num']}</b>{p['nome']}</a></th><td>{p['tab']['parcelas']}</td><td>{p['tab']['entrada']}</td><td>{p['tab']['analise']}</td><td>{p['tab']['negativado']}</td><td>{p['tab']['lojas']}</td></tr>''' for p in PAGAMENTOS)
    jornada = [('Escolha o aparelho', 'Você escolhe a marca e o modelo. Lacrado, seminovo ou usado, o estado do produto é declarado antes da compra.'),
               ('Simulação presencial', 'A equipe faz a simulação na hora, na loja. Leva poucos minutos e não tem compromisso.'),
               ('Análise e aprovação', 'Mais de 5 financeiras analisam o seu caso, cada uma com critério próprio. A entrada depende da forma de pagamento escolhida.'),
               ('Sai com o celular no mesmo dia', 'Aprovou, levou. Película e capinha saem aplicadas na loja.')]
    jor_h = ''.join(f'<li class="etapa"><span class="etapa-n" aria-hidden="true">{i + 1:02d}</span><h3>{t}</h3><p class="t2">{x}</p></li>' for i, (t, x) in enumerate(jornada))
    corpo = f'''{capa(r, '<span>Formas de pagamento</span>', 'Como comprar', ['Seis formas', 'de sair com', 'o celular novo.'], 'Cada bolso tem um caminho. A simulação é presencial e sem compromisso: você descobre a condição real antes de decidir.', acoes=btn(r + 'lojas/index.html', 'Simular na loja mais perto') + btn('#lado-a-lado', 'Comparar as seis', 's'), lado='<span class="capa-dado" aria-hidden="true">6</span>', orn=True)}
<section class="letreiro" aria-hidden="true">
  <div class="mq" data-mq="1"><div class="mq-t"><span>18x no boleto</span><b></b><span class="vazado">24x na conta de luz</span><b></b><span>44x Crédito CLT</span><b></b><span class="vazado">10x sem juros</span><b></b><span class="azul">Pix com desconto</span><b></b><span class="vazado">Troca do usado</span><b></b></div></div>
</section>
<section class="sec">
  <div class="wrap">
    {cab('01', 'Seis caminhos', ['Escolha por', 'onde você', 'quer entrar.'])}
    <div class="g3">{cards}</div>
  </div>
</section>
<section class="sec alt" id="lado-a-lado">
  <div class="wrap">
    {cab('02', 'Lado a lado', ['As seis formas', 'na mesma', 'tabela.'], sub='O que muda de uma para a outra: número de parcelas, entrada, análise e em quais lojas vale.')}
    <div class="rolavel" data-r tabindex="0" role="region" aria-label="Tabela comparativa das formas de pagamento">
      <table class="tabela"><thead><tr><th scope="col">Forma</th><th scope="col">Parcelas</th><th scope="col">Entrada</th><th scope="col">Análise</th><th scope="col">Negativado</th><th scope="col">Onde vale</th></tr></thead><tbody>{linhas}</tbody></table>
    </div>
    <p class="nota" data-r style="margin-top:1.5rem">Condições sujeitas a análise. Os campos marcados "a confirmar" dependem de dados que a rede ainda não enviou; cada página de forma mostra o que falta.</p>
  </div>
</section>
<section class="sec clara">
  <div class="wrap duo fixo">
    <div class="duo-txt">
      {cap('03', 'A compra, passo a passo')}
      {tit(['Leve RG e CNH.', 'O resto a gente', 'resolve.'])}
      <p class="t1" data-r>A simulação é presencial de propósito: é ali que dá para explicar a condição, tirar dúvida e ajustar o que precisa ser ajustado.</p>
      {foto(r, 'assets/img/fotos/interior-real.webp', 'Interior da loja de Santa Cruz do Sul', 'r43')}
    </div>
    <ol class="etapas"><span class="trilho" aria-hidden="true"><i></i></span>{jor_h}</ol>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    {cab('04', 'Antes de ir', ['Três coisas', 'para saber', 'antes.'])}
    <div class="g3">{_antes()}</div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap faq-g">
    <div class="faq-esq">{cap('05', 'Dúvidas de pagamento')}{tit(['O que mais', 'perguntam', 'no balcão.'])}<div data-r>{link(r + 'faq.html', 'Ver todas as perguntas')}</div></div>
    <div class="faq-l" data-r>{faq_itens(FAQ[:4], r, 'fq')}</div>
  </div>
</section>
{chamada(r, ['A simulação', 'não custa', 'nada.'], 'Leva poucos minutos e você descobre a condição real antes de decidir qualquer coisa.', btn(r + 'lojas/index.html', 'Encontrar a loja mais perto') + btn(ZAP_REDE, 'Perguntar no WhatsApp', 'zap', ext=True, ico=ICO['zap']))}'''
    return ('como-comprar.html', 'Como comprar na HG Smart', 'As seis formas de pagamento da Rede HG Smart lado a lado: boleto, conta de luz, Crédito CLT, cartão, Pix e troca do usado.', corpo, 'pagar')

# ═════════════════════════ CADA FORMA DE PAGAMENTO ═════════════════════════
def p_pagamento(r, p, i):
    fic = ''.join(f'<div><dt>{a}</dt><dd>{b}</dd></div>' for a, b in p['ficha'])
    bul = ''.join('<li><span>%s</span></li>' % b for b in p['bullets'])
    disp = ''
    if p['id'] == 'conta-de-luz':
        its = ''.join(f'''<a href="{r}{url_loja(l)}"{'' if l['luz'] else ' class="nao"'}><b>{l['cidade']}</b><span>{'Disponível' if l['luz'] else 'Não disponível'}</span></a>''' for l in LOJAS)
        disp = f'''<section class="sec alt"><div class="wrap">
    {cab('02', 'Disponibilidade por unidade', ['Vale em oito', 'das dez', 'lojas.'], sub='O parcelamento na conta de luz não está disponível nas unidades de Capão da Canoa e Tramandaí. Nas demais 8 unidades da rede, sim.')}
    <div class="disp" data-r>{its}</div></div></section>'''
    corpo = f'''{capa(r, '<a href="%scomo-comprar.html">Formas de pagamento</a><span>/</span><span>%s</span>' % (r, p['nome']), 'Forma %d de 6 · %s' % (i + 1, p['rot']), p['t'], p['lead'], acoes=btn(r + 'lojas/index.html', 'Simular numa loja') + btn(ZAP_REDE, 'Perguntar no WhatsApp', 'zap', ext=True, ico=ICO['zap']), lado='<div class="cel-solo" aria-hidden="true"><span class="pg-halo"></span>%s</div>' % aparelho(tela(p, i, on=True)))}
<section class="sec">
  <span class="fant" data-par aria-hidden="true" style="right:-1rem;top:-1.5rem">{p['num']}</span>
  <div class="wrap duo fixo">
    <div class="duo-txt">
      {cap('01', 'Como funciona')}
      {tit(['O essencial,', 'sem letra', 'miúda.'])}
      <ul class="lista-p" data-r>{bul}</ul>
    </div>
    <div class="pilha-l">
      <dl class="ficha" data-r>{fic}</dl>
      {pend(p['pend'][0], p['pend'][1])}
    </div>
  </div>
</section>
{disp}
<section class="sec clara">
  <div class="wrap duo">
    <div class="duo-txt">
      {cap('', 'Tirar dúvida antes de ir')}
      {tit(['A condição exata', 'sai da simulação', 'presencial.'])}
      <p class="t1" data-r>Dúvida sobre documento, prazo ou disponibilidade dá para resolver antes, pelo WhatsApp ou pelo Instagram da rede.</p>
      <div class="acoes" data-r>{btn(ZAP_REDE, 'Perguntar no WhatsApp', 'zap', ext=True, ico=ICO['zap'])}{btn(REDE['insta'], 'Perguntar no Instagram', 's', ext=True)}{btn(r + 'lojas/index.html', 'Ver as 10 lojas', 's')}</div>
    </div>
    <div class="duo-fig">{foto(r, 'assets/img/fotos/lajeado-18x.webp', 'Fachada da loja de Lajeado', 'r43', 'Lajeado')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    {cab('', 'Outras formas de pagar', ['Não é o seu', 'caso? Há outros', 'cinco caminhos.'])}
    <div class="g-flex">{outras_formas(r, p['id'])}</div>
    <div class="acoes" data-r style="margin-top:3rem">{btn(r + 'como-comprar.html#lado-a-lado', 'Ver as seis lado a lado', 's')}</div>
  </div>
</section>
{chamada(r, ['Passe numa loja.', 'A conversa é sem', 'compromisso.'], 'A simulação é presencial e leva poucos minutos.', btn(r + 'lojas/index.html', 'Encontrar a loja mais perto') + btn(r + 'como-comprar.html', 'Todas as formas de pagamento', 's'))}'''
    return (p['id'] + '.html', p['titulo'], p['desc'], corpo, 'pagar')

# ═════════════════════════ LOJAS ═════════════════════════
def _nota_google(l):
    return '<span class="g-nota"><i aria-hidden="true">★</i><b>%s</b><span>no Google · %d avaliações</span></span>' % l['google']

def cartao_loja(r, l):
    luz = '' if l['luz'] else '<p class="nota">Esta loja não trabalha com parcela na conta de luz.</p>'
    return f'''<article class="cartao loja-c" data-id="{l['id']}">
  <a class="lj-foto" href="{r}{url_loja(l)}" tabindex="-1" aria-hidden="true"><span class="loja-selo">{l['tag']}</span>{im(r, foto_loja(l), '')}</a>
  <div class="lj-corpo">
    <div class="lj-tit"><h3><a href="{r}{url_loja(l)}">{l['cidade']}</a></h3></div>
    <p class="status" data-status="{l['id']}"><span class="pulso"></span><span>Seg a sex {l['sem'][0]} – {l['sem'][1]}</span></p>
    <p class="lj-end">{l['end']}<br><span>{l['comp']} · CEP {l['cep']}</span></p>
    {horas(l)}
    {zaps(l)}
    {luz}
    {_nota_google(l)}
    <div class="lj-acoes"><a class="btn btn-p btn-mini" href="{r}{url_loja(l)}">Ver a loja</a><a class="btn btn-s btn-mini" href="{rota(l)}" target="_blank" rel="noopener">Como chegar</a></div>
  </div>
</article>'''

def p_lojas(r, mapa):
    cards = ''.join(cartao_loja(r, l) for l in LOJAS)
    filtros = [('todas', 'Todas'), ('abertas', 'Abertas agora'), ('luz', 'Com conta de luz'), ('serra', 'Serra'), ('litoral', 'Litoral'), ('vales', 'Vales e Centro'), ('metro', 'Grande Porto Alegre')]
    fil_h = ''.join('<button type="button" data-f="%s" aria-pressed="%s">%s<small></small></button>' % (k, 'true' if k == 'todas' else 'false', t) for k, t in filtros)
    corpo = f'''{capa(r, '<span>Lojas</span>', 'Lojas · Rio Grande do Sul', ['Dez unidades.', 'Sempre', 'presencial.'], 'A simulação e a análise são feitas na loja, com atendimento de gente. Chame no WhatsApp da unidade mais perto antes de ir: dá para confirmar o modelo e adiantar a conversa.', acoes=btn('#unidades', 'Ir para as unidades'), extra='<div class="etiquetas" data-r><span class="etq"><span class="pulso" data-abertas-pulso></span><span data-abertas>10</span>&nbsp;abertas agora</span><span class="etq">10 cidades com loja</span><span class="etq nao">Pelotas · em breve</span></div>', lado='<span class="capa-dado" aria-hidden="true">10</span>', orn=True)}
<section class="sec" id="mapa">
  <div class="wrap">
    {cab('01', 'No mapa', ['Onde a rede', 'já chegou.'], 'ca', sub='Toque numa cidade ou num alfinete. O status de cada loja é calculado agora, pelo horário de Brasília.')}
    {modulo_lojas(r, mapa)}
  </div>
</section>
<section class="sec alt" id="unidades">
  <div class="wrap">
    {cab('02', 'Todas as unidades', ['10 lojas,', '10 cidades.'], 'ca')}
    <div class="filtros" data-filtros-lojas data-r role="group" aria-label="Filtrar lojas" style="margin-bottom:2rem">{fil_h}</div>
    <div class="lojas-g">{cards}
      <article class="cartao loja-c breve"><div class="lj-corpo"><span class="rotulo">Em breve</span><h3 class="d3">Pelotas</h3><p class="t3">Unidade em preparação. O endereço e o horário entram aqui na abertura.</p></div></article>
    </div>
    <p class="t2" id="lojasVazio" hidden style="margin-top:2rem">Nenhuma loja neste filtro agora. Veja todas ou chame a matriz no WhatsApp.</p>
    <p class="nota" data-r style="margin-top:2rem">O horário varia por unidade. Feriados podem alterar o funcionamento; vale confirmar pelo WhatsApp da loja antes de ir.</p>
    <div style="margin-top:2rem">{pend('', ['Domingo: a versão atual do site lista Capão da Canoa (13h00–19h00) e Cachoeirinha (09h30–18h30) como abertas, e na mesma página diz que nenhuma abre. O Google registra as duas fechadas. Aqui o domingo aparece como fechado até a loja confirmar.', 'Santa Maria: o Google mostra uma segunda loja, no Santa Maria Shopping, que não está no site. Se entrar, a rede passa a 11 unidades.', 'Cada página de unidade lista os dados que divergem entre o site, o Google e o Instagram daquela loja.'], 'Dados a confirmar com as lojas')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    {cab('03', 'Antes de ir', ['Leve RG e CNH.', 'O resto a gente', 'resolve.'])}
    <div class="g3">{_antes()}</div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap duo">
    <div class="duo-txt">{cap('04', 'Não achou sua cidade?')}{tit(['A rede segue', 'abrindo', 'unidades.'])}<p class="t1" data-r>Chame em qualquer uma das lojas. Elas sabem dizer qual é a mais próxima de você e o que já está sendo atendido na sua região.</p><div class="acoes" data-r>{btn(ZAP_REDE, 'Chamar a matriz no WhatsApp', 'zap', ext=True, ico=ICO['zap'])}</div></div>
    <div class="duo-fig">{foto(r, 'assets/img/fotos/lajeado-esquina.webp', 'Loja de Lajeado, na esquina do H Comercial', 'r43', 'Lajeado')}</div>
  </div>
</section>
{chamada(r, ['Passe numa loja.', 'A conversa é sem', 'compromisso.'], 'A simulação é presencial e leva poucos minutos. Você descobre a condição real antes de decidir qualquer coisa.', btn(r + 'como-comprar.html', 'Ver as formas de pagamento') + btn(r + 'catalogo.html', 'Ver as marcas', 's'))}'''
    return ('lojas/index.html', 'Lojas da Rede HG Smart', 'As 10 unidades da Rede HG Smart no Rio Grande do Sul, com endereço, horário, WhatsApp, rota e quais estão abertas agora.', corpo, 'lojas')

# ═════════════════════════ CADA UNIDADE ═════════════════════════
NOME2 = {'santa-cruz-do-sul': ['Santa Cruz', 'do Sul.'], 'cachoeira-do-sul': ['Cachoeira', 'do Sul.'], 'capao-da-canoa': ['Capão', 'da Canoa.'], 'caxias-do-sul': ['Caxias', 'do Sul.'],
         'bento-goncalves': ['Bento', 'Gonçalves.'], 'santa-maria': ['Santa', 'Maria.']}
VISITA = [dict(q='Posso confirmar um produto antes de ir?', r='Sim. Chame a unidade no WhatsApp para consultar disponibilidade, cor e capacidade do modelo desejado.'),
          dict(q='As condições são iguais em todas as lojas?', r='As modalidades seguem a rede, mas valores, campanhas e disponibilidade podem variar. A equipe local faz a simulação presencial.'),
          dict(q='Como verifico horário e rota?', r='Os atalhos desta página abrem o WhatsApp da loja e o Google Maps. Em feriados, confirme o atendimento pelo WhatsApp.')]

def p_loja(r, l):
    c = l['cidade']
    linhas = NOME2.get(l['id'])
    titulo_h = tit(linhas, 'ca', 'h1', 'd1') if linhas else tit(['HG Smart', c + '.'], 'va', 'h1', 'd1')
    z0 = wa(l['zaps'][0], 'Olá! Vim pelo site da HG Smart e quero falar com a loja de %s.' % c)
    ig = 'https://www.instagram.com/%s/' % l['ig']
    mig = '<nav class="migalhas" aria-label="Você está em" data-r><a href="%s">Início</a><span>/</span><a href="%slojas/index.html">Lojas</a><span>/</span><span>%s</span></nav>' % (home(r), r, c)
    formas = ''
    for p in PAGAMENTOS:
        ok = l['luz'] or p['id'] != 'conta-de-luz'
        formas += f'''<a href="{r}{p['id']}.html"{'' if ok else ' class="nao"'}><b>{(p['num'] + ' · ' + p['curto']) if p['num'] != p['curto'] else p['nome']}</b><span>{'Nesta loja' if ok else 'Não nesta loja'}</span></a>'''
    nota_luz = 'As condições são as mesmas em toda a rede, e a simulação é presencial, aqui em %s inclusive.' % c if l['luz'] else 'Esta unidade <strong>não trabalha com o parcelamento na conta de luz</strong>. As demais formas valem normalmente, e a simulação é presencial aqui em %s.' % c
    if len(l['fotos']) > 1:
        gal = ''.join('<figure>%s<figcaption>%s</figcaption></figure>' % (im(r, foto_loja(l, n), t + ' · HG Smart ' + c), t) for n, t in l['fotos'])
        dentro = f'''<div class="wrap"><div class="galeria" data-r tabindex="0" aria-label="Fotos da loja de {c}">{gal}</div><p class="nota" style="margin-top:1rem">Fotos reais desta unidade, não de banco de imagem nem de outra loja da rede.</p></div>'''
    else:
        dentro = f'''<div class="wrap">{pend('', 'O acervo tem só a foto da fachada desta loja. Faltam fotos do interior, da equipe e da vitrine para montar a galeria.', 'Fotos da unidade · pendente')}</div>'''
    guias = ''
    if l['guias']:
        guias = '<div class="banner-g" style="margin-top:3rem">%s</div>' % ''.join('<figure data-r>%s</figure>' % im(r, 'assets/img/banners-lojas/%s.webp' % g, t) for g, t in l['guias'])
    vozes = ''
    if l.get('vozes'):
        vozes = f'''<section class="sec alt"><div class="wrap">{cab('', 'Quem comprou aqui', ['O que dizem', 'em %s.' % c], 'ca')}<div class="dep-g">{''.join(dep((n, 'Cliente de ' + c, 'Google', t)) for n, t in l['vozes'])}</div></div></section>'''
    outras = ''.join('<a href="%s%s"><b>%s</b><span class="pulso" data-pulso="%s" style="width:.5rem;height:.5rem"></span></a>' % (r, url_loja(o), o['cidade'], o['id']) for o in LOJAS if o['id'] != l['id'])
    na_loja = [('Smartphones', 'Modelos de marcas reconhecidas, com orientação presencial para comparar recursos.', ('catalogo.html', 'Ver as marcas')),
               ('Acessórios', 'Capas, películas, carregadores e itens para proteger e completar seu aparelho.', ('acessorios.html', 'Ver acessórios')),
               ('Condições de compra', 'Simulação presencial e sem compromisso, conforme as opções disponíveis na rede.', ('como-comprar.html', 'Ver como comprar'))]
    na_h = ''.join(f'<div class="cartao item" data-r><span class="item-n">{i + 1:02d}</span><h3>{t}</h3><p class="t3">{x}</p>{link(r + a[0], a[1])}</div>' for i, (t, x, a) in enumerate(na_loja))
    corpo = f'''<section class="capa">
  <div class="wrap capa-g">
    <div class="capa-txt">{mig}{cap('', 'Loja de celulares · ' + l['tag'])}{titulo_h}
      <p class="t1" data-r>{l['frase']} Atendimento local, smartphones, acessórios e soluções para você escolher com segurança.</p>
      <div class="etiquetas" data-r><span class="etq status" data-status="{l['id']}"><span class="pulso"></span><span>Seg a sex {l['sem'][0]} – {l['sem'][1]}</span></span>{_nota_google(l)}</div>
      <div class="acoes" data-r>{btn(z0, 'Falar no WhatsApp', 'zap', ext=True, ico=ICO['zap'])}{btn(rota(l), 'Traçar rota', 's', ext=True)}{btn(ig, 'Ver Instagram', 's', ext=True)}</div>
    </div>
    <div class="capa-lado">{foto(r, foto_loja(l), l['fotos'][0][1] + ' · HG Smart ' + c, 'r45' if DIM[foto_loja(l)][1] > DIM[foto_loja(l)][0] else 'r43', l['fotos'][0][1], lazy=False)}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap duo fixo">
    <div class="pilha">
      {cap('01', 'A unidade')}
      {tit(['Endereço,', 'horário e', 'WhatsApp.'])}
      <dl class="ficha" data-r>
        <div><dt>Endereço</dt><dd><strong>{l['end']}</strong><br>{l['comp']}<br>{c} · RS · CEP {l['cep']}<br>{link(rota(l), 'Como chegar', ext=True)}</dd></div>
        <div><dt>Horário</dt><dd>{horas(l)}</dd></div>
        <div><dt>WhatsApp</dt><dd><p class="t3" style="margin-bottom:.75rem">{len(l['zaps'])} números atendem esta loja.</p>{zaps(l)}</dd></div>
        <div><dt>Instagram</dt><dd><a class="btn-t" href="{ig}" target="_blank" rel="noopener">@{l['ig']}{ICO['seta']}</a><br><span class="t3">Fotos, novidades e campanhas desta loja.</span></dd></div>
      </dl>
    </div>
    <div class="pilha">
      {cap('02', 'Formas de pagamento nesta loja')}
      <p class="t2" data-r>{nota_luz}</p>
      <div class="disp" data-r>{formas}</div>
      <div data-r>{link(r + 'como-comprar.html', 'Comparar as formas de pagamento')}</div>
    </div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap">{cab('03', 'Por dentro da unidade', ['Conheça a', 'HG Smart', c + '.'])}</div>
  {dentro}
</section>
<section class="sec">
  <div class="wrap">
    {cab('04', 'Na unidade', ['Tudo para o', 'seu próximo', 'celular.'], sub='Consulte disponibilidade, modelos e condições diretamente com a equipe local antes de se deslocar.')}
    <div class="g3">{na_h}</div>
    {guias}
  </div>
</section>
{vozes}
<section class="sec alt">
  <div class="wrap faq-g">
    <div class="faq-esq">{cap('05', 'Antes de visitar')}{tit(['Dúvidas', 'rápidas.'], 'ca')}<div data-r>{link(r + 'faq.html', 'Ver todas as perguntas')}</div></div>
    <div class="faq-l" data-r>{faq_itens(VISITA, r, 'fv')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap pilha-l">
    {pend('', l['conferir'], 'Dados a confirmar com a loja de ' + c)}
    <div class="pilha">{cap('', 'Outras unidades da rede')}<div class="disp" data-r>{outras}</div></div>
  </div>
</section>
{chamada(r, ['Sua HG Smart', 'em ' + c + '.'], l['end'] + ' · ' + l['comp'] + '.', btn(z0, 'Falar no WhatsApp', 'zap', ext=True, ico=ICO['zap']) + btn(rota(l), 'Abrir rota no Google', 's', ext=True))}'''
    return (url_loja(l), 'HG Smart %s' % c, 'Loja de celulares HG Smart em %s: %s, %s. Horário, WhatsApp, rota e formas de pagamento da unidade.' % (c, l['end'], l['comp']), corpo, 'lojas', l)
