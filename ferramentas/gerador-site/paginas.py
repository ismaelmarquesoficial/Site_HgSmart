# -*- coding: utf-8 -*-
"""Páginas: início e institucionais. Cada função devolve (arquivo, título, descrição, corpo, item do menu)."""
from base import *

def _vozes_mq(vs, sentido):
    return '<div class="mq" data-mq="%d" data-fixo="1" data-pausa="1"><div class="mq-t">%s</div></div>' % (sentido, ''.join(dep(v) for v in vs))

def _marcas_faixa(r):
    return '<div class="faixa-marcas" aria-label="Marcas que a rede trabalha"><div class="mq" data-mq="1" data-fixo="1"><div class="mq-t">%s</div></div></div>' % ''.join(
        '<span class="marca">%s</span>' % im(r, 'assets/img/marcas/%s.jpg' % i, n, lazy=None) for i, n in TODAS_MARCAS)

def _nums():
    itens = [('10', '', 'unidades no Rio Grande do Sul'), ('18', 'x', 'parcelas no boleto, sem cartão'), ('24', 'x', 'na conta de luz, sem entrada'),
             ('44', 'x', 'no Crédito CLT, para carteira assinada'), ('5', '+', 'financeiras parceiras na análise'), ('9', '', 'marcas de aparelhos e acessórios')]
    return '<section class="nums" aria-label="A rede hoje"><div class="wrap nums-g">%s</div></section>' % ''.join(
        '<div class="nm" data-r><strong data-conta="%s" data-suf="%s">%s%s</strong><span>%s</span></div>' % (n, s, n, s, t) for n, s, t in itens)

# ═════════════════════════ INÍCIO ═════════════════════════
def p_home(r, mapa):
    slides = ''
    for i, (n, alt, href, leg) in enumerate(CAMPANHAS):
        slides += f'''<div class="vt-slide{' on' if i == 0 else ''}" role="group" aria-roledescription="campanha" aria-label="{i + 1} de {len(CAMPANHAS)}" data-leg="{esc(leg)}"><a href="{r}{href}" aria-label="{esc(alt)}"><picture><source media="(min-width:700px)" srcset="{r}assets/img/banners/banner-{n}-desktop-1280.webp" width="1280" height="493"><img src="{r}assets/img/banners/banner-{n}-mobile.webp" alt="{esc(alt)}" width="900" height="900"{'' if i == 0 else ' loading="lazy"'} decoding="async"></picture></a></div>'''
    pontos = ''.join('<button type="button" aria-label="Campanha %d: %s" aria-current="%s"></button>' % (i + 1, esc(c[3]), 'true' if i == 0 else 'false') for i, c in enumerate(CAMPANHAS))

    passos = ''
    for i, p in enumerate(PAGAMENTOS):
        passos += f'''<article class="passo" data-num="{p['num']}">
          <span class="passo-r"><b>{i + 1:02d}</b>{p['rot']}</span>
          <span class="passo-num" aria-hidden="true">{p['num']}</span>
          {tit(p['t'], 'cva', 'h3', 'd3', grade=False)}
          <p class="t2">{p['passo']}</p>
          <ul>{''.join('<li><span>%s</span></li>' % b for b in p['bullets'])}</ul>
          <div class="passo-fig" aria-hidden="true">{FIG[p['id']]}</div>
          {link(r + p['id'] + '.html', 'Como funciona: ' + p['nome'].lower())}
        </article>'''
    telas = ''.join(tela(p, i, on=(i == 0)) for i, p in enumerate(PAGAMENTOS))
    navs = ''.join('<button type="button" aria-label="Ir para %s"></button>' % p['nome'] for p in PAGAMENTOS)

    marcas = ''.join(f'''<a class="cartao marca-c" href="{r}catalogo.html#{m['id']}" data-r><span class="marca-logo">{im(r, 'assets/img/marcas/%s.jpg' % m['id'], '')}</span><h3>{m['nome']}</h3><p class="t3">{m['txt']}</p></a>''' for m in MARCAS)
    marcas += f'''<a class="cartao marca-c" href="{r}catalogo.html#seminovos" data-r><span class="item-dado" aria-hidden="true" style="height:4.5rem;display:flex;align-items:center">Semi</span><h3>Seminovos</h3><p class="t3">iPhones e Androids seminovos, com o estado do produto declarado antes da compra.</p></a>'''

    propria = ''.join(f'''<div class="cartao mini"><span class="rotulo">{tipo}</span><b>{nome}</b><span>{txt}</span></div>''' for nome, tipo, txt in MARCA_PROPRIA)
    etqs = ''.join('<span class="etq">%s</span>' % a[0] for a in ACESSORIOS)

    foco = [('Garantia oficial', 'Trabalhamos com as principais marcas do mercado, sempre com procedência e garantia. Nada de origem duvidosa.', None),
            ('Garantia estendida', 'Todo aparelho já sai com garantia. A estendida amplia esse prazo e a cobertura, e é contratada na própria loja.', ('garantia.html', 'Ver garantia estendida')),
            ('Troca do usado', 'O celular que você já tem é avaliado na loja e o valor entra como parte do pagamento do novo.', ('troca-do-usado.html', 'Como funciona a troca')),
            ('Análise responsável', 'Aprovação facilitada não é aprovação a qualquer custo. A análise é transparente para que você saiba como está comprando.', None)]
    foco_h = ''.join(f'''<div class="cartao item" data-r><span class="item-n">{i + 1:02d}</span><h3>{t}</h3><p class="t3">{x}</p>{link(r + l[0], l[1]) if l else ''}</div>''' for i, (t, x, l) in enumerate(foco))

    faq5 = [FAQ[3], FAQ[4], FAQ[5], FAQ[0], FAQ[1]]

    corpo = f'''<section class="hero" id="topo">
  <div class="hero-foto">{im(r, 'assets/img/fotos/hero.webp', '', lazy=False)}</div>
  <div class="hero-veu"></div>
  <div class="hero-luz"></div>
  <div class="wrap hero-in">
    {cap('', 'Rede HG Smart · Rio Grande do Sul')}
    {tit(['Tecnologia', 'não devia ser', 'privilégio.'], 'cva', 'h1', 'd1')}
    <div class="acoes" data-r>{btn(r + 'lojas/index.html', 'Encontre a loja mais próxima')}{btn(r + 'quem-somos.html', 'Conhecer a rede', 's')}</div>
    <aside class="hero-status cartao" data-r aria-label="Lojas abertas agora">
      <span class="rotulo" style="display:flex;align-items:center;gap:.5rem"><span class="pulso" data-abertas-pulso></span>Agora nas lojas</span>
      <strong class="st-num"><span data-abertas>10</span><small>/10</small></strong>
      <span class="st-txt" data-abertas-txt>unidades na rede</span>
      {link(r + 'lojas/index.html', 'Ver quais')}
    </aside>
  </div>
  <div class="hero-rolar rotulo" aria-hidden="true">Role<i></i></div>
</section>

<section class="letreiro" aria-hidden="true">
  <div class="mq" data-mq="1"><div class="mq-t"><span>18x no boleto</span><b></b><span class="vazado">24x na conta de luz</span><b></b><span>44x Crédito CLT</span><b></b><span class="vazado">10x sem juros</span><b></b></div></div>
  <div class="mq" data-mq="-1"><div class="mq-t"><span class="vazado">Pix com desconto</span><b></b><span class="azul">Troca do usado</span><b></b><span class="vazado">Só RG e CNH</span><b></b><span>Sai no mesmo dia</span><b></b></div></div>
</section>

<section class="sec curta" aria-label="Campanhas da rede">
  <div class="wrap">
    <div class="cab">{cap('', 'Em cartaz nas lojas')}</div>
    <div class="vitrine" data-r>
      <div class="vt-palco">{slides}</div>
      <div class="vt-pe"><div class="vt-pontos">{pontos}</div><p class="vt-leg" aria-live="polite">{esc(CAMPANHAS[0][3])}</p><div class="vt-setas"><button type="button" data-ant aria-label="Campanha anterior">{ICO['esq']}</button><button type="button" data-prox aria-label="Próxima campanha">{ICO['dir']}</button></div></div>
    </div>
  </div>
</section>

<section class="sec alt pg" id="pagar">
  <div class="wrap">
    {cab('01', 'Formas de pagamento', ['Seis caminhos', 'para o mesmo', 'lugar.'], sub='Cada bolso tem um caminho. A simulação é presencial e sem compromisso: você descobre a condição real antes de decidir.')}
    <div class="pg-g">
      <div class="pg-caps">{passos}</div>
      <div class="pg-cel"><span class="pg-halo" aria-hidden="true"></span><span class="pg-fant" aria-hidden="true">{PAGAMENTOS[0]['num']}</span><div aria-hidden="true">{aparelho(telas)}</div><div class="pg-nav">{navs}</div></div>
    </div>
    <div class="acoes" data-r style="margin-top:3rem">{btn(r + 'como-comprar.html', 'Comparar as seis lado a lado', 's')}</div>
    <p class="nota" data-r style="margin-top:1.5rem">Condições sujeitas a análise. Para a simulação basta RG e CNH, e a conferência é feita presencialmente, em qualquer uma das unidades.</p>
  </div>
</section>

{_nums()}

<section class="sec" id="smartphones">
  <span class="fant" data-par aria-hidden="true" style="right:-1rem;top:-1.5rem">02</span>
  <div class="wrap">
    {cab('02', 'Smartphones', ['Nove marcas.', 'Uma condição para', 'cada bolso.'], sub='Aparelhos lacrados e seminovos, sempre com o estado do produto declarado com clareza. Aqui não trabalhamos com preço: a condição sai da simulação presencial.')}
    <div class="marca-g">{marcas}</div>
    <div class="acoes" data-r style="margin-top:3rem">{btn(r + 'catalogo.html', 'Ver smartphones e marcas', 's')}</div>
  </div>
</section>
{_marcas_faixa(r)}

<section class="sec alt" id="acessorios">
  <div class="wrap duo">
    <div class="duo-fig colagem">{foto(r, 'assets/lojas/farroupilha/interior-3.webp', 'Parede de películas e acessórios da loja de Farroupilha', 'r45')}{foto(r, 'assets/lojas/caxias-do-sul/interior-2.webp', 'Parede de capinhas da loja de Caxias do Sul', 'r45')}</div>
    <div class="duo-txt">
      {cap('03', 'Acessórios e marca própria')}
      {tit(['Película e capinha', 'saem aplicadas', 'na loja.'])}
      <p class="t1" data-r>Linha completa para o seu celular e itens de tecnologia para o dia a dia, com três produtos de marca própria.</p>
      <div class="mini-g" data-r>{propria}</div>
      <div class="etiquetas" data-r>{etqs}</div>
      <div data-r>{link(r + 'acessorios.html', 'Ver todos os acessórios')}</div>
    </div>
  </div>
</section>

<section class="sec" id="foco">
  <span class="fant" data-par aria-hidden="true" style="left:-1rem;top:-1.5rem">04</span>
  <div class="wrap">
    {cab('04', 'Garantia e troca', ['Aparelho com', 'procedência.', 'Estado declarado.'], sub='Lacrado, seminovo ou usado: as três categorias existem, e o estado do produto é sempre declarado antes da compra. Você sabe exatamente o que está levando.')}
    <div class="g4">{foco_h}</div>
  </div>
</section>

<section class="sec clara vz" id="clientes">
  <div class="wrap">
    <div class="cab">
      {cap('05', 'Quem já comprou')}
      <div class="cab-linha">{tit(['O que nossos', 'clientes dizem.'], 'ca')}
        <div class="selo-g" data-r><strong>{('%d' % TOTAL_AVALIACOES)[:-3] + '.' + ('%d' % TOTAL_AVALIACOES)[-3:]}</strong><span class="t3" style="max-width:16rem">avaliações no Google, somando as dez lojas. Levantamento de agosto de 2026.</span></div></div>
    </div>
  </div>
  {_vozes_mq(VOZES[:7], 1)}
  {_vozes_mq(VOZES[7:], -1)}
  <div class="wrap"><p class="t3" data-r style="margin-top:2rem">Avaliações publicadas no Google, reproduzidas como foram escritas.</p></div>
</section>

<section class="sec" id="historia">
  <div class="wrap duo">
    <div class="duo-txt">
      {cap('06', 'Nossa história')}
      {tit(['Nasceu de um sonho', 'simples, mas muito', 'ambicioso.'])}
      <p class="t1" data-r>Tornar a tecnologia acessível para todos. Tudo começou com a vontade de criar uma loja diferente, onde o cliente fosse atendido com transparência, respeito e condições reais de compra.</p>
      <p class="t2" data-r>Desde o primeiro dia o objetivo nunca foi apenas vender celulares, mas <strong>oferecer oportunidades</strong>, especialmente para quem encontrava dificuldade de aprovação em outras lojas.</p>
      <div data-r>{link(r + 'quem-somos.html', 'Conhecer a rede inteira')}</div>
    </div>
    <div class="duo-fig">{foto(r, 'assets/img/fotos/fachada-real.webp', 'Movimento na calçada da matriz, em Santa Cruz do Sul, em dia de ação', 'r43', 'Matriz · Santa Cruz do Sul')}</div>
  </div>
</section>

<section class="sec alt" id="ceo">
  <div class="wrap duo inv">
    <div class="duo-fig">{foto(r, 'assets/img/ceo/eduardo-1.webp', 'Eduardo Hermes, CEO da Rede HG Smart', 'r43')}</div>
    <div class="duo-txt">
      {cap('07', 'Conheça o CEO')}
      {tit(['Eduardo', 'Hermes.'], 'ca')}
      <p class="t1" data-r>Quem começou, por quê, e para onde a rede vai.</p>
      <p class="t2" data-r>Fundador e CEO da Rede HG Smart, que faz parte do Grupo Hermes.</p>
      <div data-r>{link(r + 'ceo.html', 'Conhecer o Eduardo')}</div>
    </div>
  </div>
</section>

<section class="sec" id="lojas">
  <span class="fant" data-par aria-hidden="true" style="right:-1rem;top:-1.5rem">08</span>
  <div class="wrap">
    {cab('08', 'Onde nos encontrar', ['Dez unidades,', 'um jeito só de', 'atender.'], sub='Toque numa cidade ou num alfinete. O status de cada loja é calculado agora, pelo horário de Brasília.')}
    {modulo_lojas(r, mapa)}
    <div class="acoes" data-r style="margin-top:3rem">{btn(r + 'lojas/index.html', 'Ver todas as lojas', 's')}</div>
  </div>
</section>

<section class="sec alt" id="faq">
  <div class="wrap faq-g">
    <div class="faq-esq">
      {cap('09', 'Perguntas frequentes')}
      {tit(['As dúvidas', 'que todo mundo', 'tem.'], 'cvv')}
      <p class="t1" data-r>Se a sua não estiver aqui, chame no WhatsApp da loja mais perto.</p>
      <div data-r>{link(r + 'faq.html', 'Ver todas as perguntas')}</div>
    </div>
    <div class="faq-l" data-r>{faq_itens(faq5, r, 'fq')}</div>
  </div>
</section>

{chamada(r, ['Passe numa loja.', 'A conversa é sem', 'compromisso.'], 'A simulação é presencial e leva poucos minutos. Você descobre a condição real antes de decidir qualquer coisa.', btn(r + 'lojas/index.html', 'Encontrar a loja mais perto') + btn(r + 'como-comprar.html', 'Ver as formas de pagamento', 's'))}'''
    return (None, 'Rede HG Smart', 'Rede de lojas de celulares no Rio Grande do Sul. Dez unidades, aparelhos com procedência e seis formas de pagamento: boleto, conta de luz, Crédito CLT, cartão, Pix e troca do usado.', corpo, 'home')

# ═════════════════════════ SOBRE ═════════════════════════
def p_sobre(r):
    atos = [('A primeira loja', 'Desde o primeiro dia o objetivo não era só vender celulares, mas oferecer oportunidade, especialmente para quem encontrava dificuldade de aprovação em outras lojas. Aparelhos de procedência, garantia oficial e pagamento facilitado.'),
            ('A expansão pelo estado', 'A empresa cresceu, ampliou a estrutura e passou a atuar em diferentes cidades do Rio Grande do Sul. Cada unidade nova reforçou o mesmo compromisso: inovação, ética, honestidade e atendimento especializado.'),
            ('A rede consolidada', 'Hoje são milhares de aparelhos vendidos e uma base sólida de clientes. Seguimos investindo em estrutura, equipe e expansão, mantendo a essência que trouxe até aqui: proximidade, condições facilitadas e transparência em cada negociação.')]
    atos_h = ''.join(f'<li class="etapa"><span class="etapa-n" aria-hidden="true">{i + 1:02d}</span><h3>{t}</h3><p class="t2">{x}</p></li>' for i, (t, x) in enumerate(atos))
    valores = [('Honestidade', 'transparência em todas as relações'), ('Ética', 'princípios sólidos e respeito ao cliente'), ('Comprometimento', 'foco em soluções de valor'), ('Excelência', 'processos simples e eficientes'), ('Foco em resultados', 'geração de valor para todos')]
    val_h = ''.join(f'<div><dt>{a}</dt><dd>{b[0].upper() + b[1:]}.</dd></div>' for a, b in valores)
    grupo = [('HG Smart', 'Rede de lojas de celulares, acessórios e serviços.', None), ('Troop Telecom', 'Operadora de telefonia móvel do grupo: planos, ativação, portabilidade e recarga nas lojas HG.', ('servicos.html#troop', 'Ver nos serviços'))]
    grupo_h = ''.join(f'<div class="cartao item" data-r><span class="rotulo">Grupo Hermes</span><h3>{t}</h3><p class="t3">{x}</p>{link(r + l[0], l[1]) if l else ""}</div>' for t, x, l in grupo)
    corpo = f'''{capa(r, '<span>Sobre a HG Smart</span>', 'A rede · Desde a primeira loja', ['Começou atendendo', 'quem ninguém', 'atendia.'], 'A HG Smart nasceu de um sonho simples e ambicioso: tornar a tecnologia acessível para todos. Não era sobre vender celular. Era sobre criar uma loja onde o cliente fosse tratado com transparência e saísse com uma condição real de compra.', lado=foto(r, 'assets/img/fotos/hero.webp', 'Fachada da matriz da HG Smart em Santa Cruz do Sul', 'r45', 'Matriz · Santa Cruz do Sul', lazy=False))}
<section class="nums" aria-label="A rede hoje"><div class="wrap nums-g">
  <div class="nm" data-r><strong data-conta="10" data-suf="">10</strong><span>unidades no Rio Grande do Sul</span></div>
  <div class="nm" data-r><strong data-conta="10" data-suf="">10</strong><span>cidades atendidas</span></div>
  <div class="nm" data-r><strong data-conta="5" data-suf="+">5+</strong><span>financeiras parceiras na análise</span></div>
  <div class="nm" data-r><strong data-conta="9" data-suf="">9</strong><span>marcas de aparelhos e acessórios</span></div>
</div></section>

<section class="sec">
  <span class="fant" data-par aria-hidden="true" style="right:-1rem;top:-1.5rem">01</span>
  <div class="wrap duo fixo">
    <div class="duo-txt">
      {cap('01', 'Nossa história, em três atos')}
      {tit(['Aparelho de', 'procedência,', 'pagamento facilitado.'])}
      <p class="t1" data-r>A proposta sempre foi clara: aparelhos de procedência, garantia oficial e pagamento facilitado, para que mais pessoas pudessem sair da loja com o smartphone novo em mãos.</p>
      {foto(r, 'assets/img/fotos/fachada-real.webp', 'Calçada movimentada em frente à matriz, em dia de ação', 'r43')}
    </div>
    <ol class="etapas"><span class="trilho" aria-hidden="true"><i></i></span>{atos_h}</ol>
  </div>
</section>

<section class="sec clara">
  <div class="wrap duo">
    <div class="duo-fig">{foto(r, 'assets/img/fotos/interior-real.webp', 'Interior da loja de Santa Cruz do Sul', 'r43')}</div>
    <div class="duo-txt">
      {cap('02', 'Por que presencial')}
      {tit(['Loja física,', 'atendimento', 'de gente.'])}
      <p class="t1" data-r>A simulação é presencial de propósito. É ali que dá para explicar a condição, tirar dúvida e ajustar o que precisa ser ajustado.</p>
      <div data-r>{link(r + 'lojas/index.html', 'Ver as unidades')}</div>
    </div>
  </div>
</section>

<section class="sec alt">
  <div class="wrap">
    {cab('03', 'Missão, visão e valores', ['O que move', 'a rede.'], 'ca')}
    <div class="g2">
      <div class="cartao item" data-r><span class="rotulo">Missão</span><p class="t1">Buscar constantemente a inovação em produtos e serviços, com atendimento especializado e soluções que atendam clientes, colaboradores e a comunidade.</p></div>
      <div class="cartao item" data-r><span class="rotulo">Visão</span><p class="t1">Ser uma das maiores redes de assistência técnica, acessórios e venda de aparelhos celulares do Sul do Brasil.</p></div>
    </div>
    <dl class="ficha" data-r style="margin-top:3rem">{val_h}</dl>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    {cab('04', 'O que vem', ['Expansão,', 'conexão', 'e liberdade.'], sub='Queremos abrir novas lojas e chegar a mais cidades. O propósito é a liberdade de comprar um celular com facilidade e se conectar com o mundo: para trabalhar, estudar, empreender ou manter contato com quem se ama.')}
    <p class="citacao degrau" data-r>Acreditamos que <span class="azul">tecnologia é inclusão.</span></p>
    <div class="g3" style="margin-top:4rem">{grupo_h}
      <a class="cartao item" href="{r}ceo.html" data-r><span class="rotulo">Liderança</span><h3>Eduardo Hermes</h3><p class="t3">Fundador e CEO da Rede HG Smart.</p><span class="btn-t">Conhecer o CEO{ICO['seta']}</span></a>
    </div>
    <div style="margin-top:3rem">{pend('', 'O briefing cita Pelotas como próxima unidade. Data de abertura e endereço entram aqui quando forem confirmados. O significado completo da sigla HG também está por confirmar.', 'A confirmar')}</div>
  </div>
</section>

{chamada(r, ['Venha conhecer', 'uma das dez', 'unidades.'], 'O atendimento é o mesmo nas dez cidades. Chame a loja no WhatsApp antes de ir e adiante a conversa.', btn(r + 'lojas/index.html', 'Ver as unidades') + btn(r + 'catalogo.html', 'Ver as marcas', 's'))}'''
    return ('quem-somos.html', 'Sobre a Rede HG Smart', 'História, missão, visão e valores da Rede HG Smart: dez lojas de celulares no Rio Grande do Sul, do Grupo Hermes.', corpo, 'sobre')

# ═════════════════════════ CEO ═════════════════════════
def p_ceo(r):
    corpo = f'''{capa(r, '<a href="%squem-somos.html">Sobre a HG Smart</a><span>/</span><span>CEO</span>' % r, 'Conheça o CEO', ['Eduardo', 'Hermes.'], 'Quem começou, por quê, e para onde a rede vai.', 'ca', lado=foto(r, 'assets/img/ceo/eduardo-2.webp', 'Eduardo Hermes, fundador e CEO da Rede HG Smart', 'r45', lazy=False))}
<section class="sec">
  <div class="wrap duo">
    <div class="duo-txt">
      {cap('01', 'O que já se sabe')}
      {tit(['Fundador e CEO', 'da Rede', 'HG Smart.'])}
      <dl class="ficha" data-r>
        <div><dt>Cargo</dt><dd>Fundador e CEO da Rede HG Smart.</dd></div>
        <div><dt>Grupo</dt><dd>A HG Smart faz parte do <strong>Grupo Hermes</strong>, que também reúne a operadora Troop Telecom.</dd></div>
        <div><dt>A rede hoje</dt><dd>Dez unidades em dez cidades do Rio Grande do Sul, com matriz em Santa Cruz do Sul.</dd></div>
        <div><dt>O que vem</dt><dd>Abrir novas lojas e chegar a mais cidades. O lema da rede é expansão, conexão e liberdade.</dd></div>
      </dl>
    </div>
    <div class="duo-fig">{foto(r, 'assets/img/ceo/eduardo-1.webp', 'Eduardo Hermes em ensaio da marca', 'r43')}</div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap">
    {cap('02', 'A tese da rede')}
    <p class="citacao" data-r style="margin-top:1.5rem;max-width:18ch">Tecnologia não devia ser <span class="azul">privilégio.</span></p>
    <p class="t1 degrau" data-r style="margin-top:2rem">A HG Smart nasceu para atender quem encontrava dificuldade de aprovação em outras lojas. A crença que sustenta a rede é uma só: tecnologia é inclusão.</p>
    <div style="margin-top:3rem">{pend('B9', 'Falta o texto sobre Eduardo Hermes (fundação, trajetória, expansão) e o vídeo institucional que o briefing pede. As fotos desta página vêm do acervo do repositório e o uso no site precisa da confirmação dele.')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap g2">
    {foto(r, 'assets/img/ceo/eduardo-3.webp', 'Eduardo Hermes no escritório da rede', 'r43')}
    {foto(r, 'assets/img/ceo/eduardo-4.webp', 'Eduardo Hermes com aparelhos da loja', 'r43')}
  </div>
</section>
{chamada(r, ['Conheça a rede', 'que ele', 'começou.'], 'A história, a missão e os valores da HG Smart estão na página sobre a rede.', btn(r + 'quem-somos.html', 'Sobre a HG Smart') + btn(r + 'lojas/index.html', 'Ver as lojas', 's'))}'''
    return ('ceo.html', 'Eduardo Hermes, CEO da HG Smart', 'Conheça Eduardo Hermes, fundador e CEO da Rede HG Smart, do Grupo Hermes.', corpo, 'ceo')

# ═════════════════════════ SMARTPHONES ═════════════════════════
def p_catalogo(r):
    blocos = ''
    for i, m in enumerate(MARCAS):
        blocos += f'''<article class="cartao marca-c" id="{m['id']}" data-r><span class="marca-logo">{im(r, 'assets/img/marcas/%s.jpg' % m['id'], '')}</span><h3>{m['nome']}</h3><p class="t3">{m['txt']}</p></article>'''
    outras = ''.join('<span class="marca">%s</span>' % im(r, 'assets/img/marcas/%s.jpg' % i, n) for i, n in OUTRAS_MARCAS)
    estados = [('Lacrado', 'Aparelho novo, na caixa, com garantia oficial de fábrica.'), ('Seminovo', 'iPhones e Androids seminovos, com procedência verificada e garantia.'), ('Usado', 'O estado é declarado com clareza antes da compra. Você sabe exatamente o que está levando.')]
    est_h = ''.join(f'<div class="cartao item" data-r><span class="item-n">{i + 1:02d}</span><h3>{t}</h3><p class="t3">{x}</p></div>' for i, (t, x) in enumerate(estados))
    pg4 = ''.join(f'''<a class="cartao item" href="{r}{p['id']}.html" data-r><span class="item-dado" aria-hidden="true">{p['num']}</span><h3>{p['nome']}</h3><p class="t3">{p['resumo']}</p></a>''' for p in PAGAMENTOS[:4])
    guias = [('guia-melhor-camera-santa-cruz', 'Qual celular tem a melhor câmera?'), ('guia-samsung-ou-motorola-caxias', 'Samsung ou Motorola: qual escolher?'), ('guia-iphone-seminovo-farroupilha', 'Vale a pena comprar um iPhone seminovo?'),
             ('guia-custo-beneficio-farroupilha', 'Qual Android tem o melhor custo-benefício?'), ('guia-o-que-analisar-bento', 'O que analisar antes de comprar um celular?'), ('encontre-seu-celular', 'Encontre o seu novo celular aqui')]
    guias_h = ''.join('<figure data-r>%s</figure>' % im(r, 'assets/img/banners-lojas/%s.webp' % g, t) for g, t in guias)
    corpo = f'''{capa(r, '<span>Smartphones</span>', 'Marcas · O que as lojas têm', ['Nove marcas.', 'Uma condição para', 'cada bolso.'], 'Aparelhos lacrados, seminovos e usados, com o estado do produto sempre declarado. Aqui não trabalhamos com preço: a condição sai da simulação presencial, feita em qualquer uma das dez unidades.', acoes=btn(r + 'lojas/index.html', 'Fazer a simulação numa loja') + btn(r + 'como-comprar.html', 'Formas de pagamento', 's'), lado='<span class="capa-dado" aria-hidden="true">9</span>')}
{_marcas_faixa(r)}
<section class="sec">
  <div class="wrap">
    {cab('01', 'As cinco principais', ['Do Android de entrada', 'ao iPhone', 'de topo.'])}
    <div class="g-flex">{blocos}</div>
    <div class="cab-linha" style="margin-top:3rem" data-r><p class="t2">Outras marcas trabalhadas pela rede: LG, Itel, Blu e Infinix.</p><div class="etiquetas">{outras}</div></div>
    <div style="margin-top:3rem">{pend('', 'O catálogo de modelos em destaque ainda não foi enviado. A página apresenta as marcas e não lista modelo nem preço: o briefing define o site como institucional, sem carrinho.', 'Catálogo de modelos · pendente')}</div>
  </div>
</section>
<section class="sec alt" id="seminovos">
  <div class="wrap duo">
    <div class="duo-txt">
      {cap('02', 'Lacrado, seminovo ou usado')}
      {tit(['As três categorias', 'existem. O estado é', 'sempre declarado.'])}
      <p class="t1" data-r>Os smartphones seminovos têm categoria própria na rede. Algumas lojas, como Cachoeirinha e Tramandaí, dão destaque próprio a eles.</p>
    </div>
    <div class="duo-fig">{foto(r, 'assets/lojas/capao-da-canoa/interior-2.webp', 'Vitrine iluminada de iPhones na loja de Capão da Canoa', 'r45')}</div>
  </div>
  <div class="wrap g3" style="margin-top:3rem">{est_h}</div>
</section>
<section class="sec">
  <div class="wrap">
    {cab('03', 'Como pagar', ['O preço é um.', 'O caminho', 'é seu.'])}
    <div class="g4">{pg4}</div>
    <div class="acoes" data-r style="margin-top:3rem">{btn(r + 'como-comprar.html', 'Ver as seis formas de pagamento', 's')}</div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap">
    {cab('04', 'Guias de compra', ['Antes de', 'escolher,', 'compare.'], sub='As lojas publicam guias no blog da rede para ajudar na escolha do aparelho.')}
    <div class="banner-g">{guias_h}</div>
    <div class="acoes" data-r style="margin-top:3rem">{btn(REDE['blog'], 'Ler no blog da HG Smart', 's', ext=True)}</div>
  </div>
</section>
{chamada(r, ['Escolha o aparelho.', 'A condição sai', 'na hora.'], 'Chame a loja no WhatsApp para consultar disponibilidade, cor e capacidade do modelo antes de ir.', btn(r + 'lojas/index.html', 'Encontrar a loja mais perto') + btn(r + 'acessorios.html', 'Ver acessórios', 's'))}'''
    return ('catalogo.html', 'Smartphones e marcas da HG Smart', 'Samsung, Apple, Xiaomi, Motorola, Realme, LG, Itel, Blu e Infinix: aparelhos lacrados, seminovos e usados nas dez lojas HG Smart.', corpo, 'smart')

# ═════════════════════════ ACESSÓRIOS ═════════════════════════
def p_acessorios(r):
    propria = ''.join(f'<div class="cartao item" data-r><span class="rotulo">Marca própria · {tipo}</span><h3>{nome}</h3><p class="t3">{txt}</p></div>' for nome, tipo, txt in MARCA_PROPRIA)
    linha = ''.join(f'<div class="cartao mini" data-r><b>{n}</b><span>{d}</span></div>' for n, d in ACESSORIOS)
    gal = [('assets/lojas/caxias-do-sul/interior-3.webp', 'Caxias do Sul'), ('assets/lojas/tramandai/interior-2.webp', 'Tramandaí'), ('assets/lojas/cachoeirinha/interior-2.webp', 'Cachoeirinha'), ('assets/lojas/farroupilha/interior-2.webp', 'Farroupilha'), ('assets/lojas/caxias-do-sul/interior-2.webp', 'Caxias do Sul'), ('assets/lojas/lajeado/interior-1.webp', 'Lajeado')]
    gal_h = ''.join('<figure>%s<figcaption>%s</figcaption></figure>' % (im(r, s, 'Acessórios na loja de ' + c), c) for s, c in gal)
    corpo = f'''{capa(r, '<span>Acessórios</span>', 'Acessórios e tecnologia', ['Linha completa', 'para o seu', 'celular.'], 'Itens para proteger, carregar e completar o aparelho, e tecnologia para o dia a dia. Película e capinha saem aplicadas na loja, na hora.', acoes=btn(r + 'lojas/index.html', 'Encontrar a loja mais perto'), lado=foto(r, 'assets/lojas/farroupilha/interior-3.webp', 'Parede de películas e acessórios da loja de Farroupilha', 'r45', 'Farroupilha', lazy=False))}
<section class="sec">
  <div class="wrap">
    {cab('01', 'Marca própria HG', ['Películas e capinhas', 'com o nome', 'da rede.'], sub='A aplicação das películas é feita nas lojas.')}
    <div class="g3">{propria}</div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap">
    {cab('02', 'A linha completa', ['Do cabo', 'ao relógio', 'inteligente.'])}
    <div class="mini-g">{linha}</div>
    <p class="nota" data-r style="margin-top:1.5rem">A disponibilidade varia por unidade. Consulte a loja pelo WhatsApp antes de ir.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap">{cab('03', 'Nas lojas', ['Paredes inteiras', 'de capinha,', 'película e som.'])}</div>
  <div class="wrap"><div class="galeria" data-r tabindex="0" aria-label="Fotos de acessórios nas lojas">{gal_h}</div></div>
</section>
{chamada(r, ['Comprou o celular?', 'Sai protegido', 'da loja.'], 'Película e capinha aplicadas na hora, em qualquer uma das dez unidades.', btn(r + 'lojas/index.html', 'Ver as lojas') + btn(r + 'catalogo.html', 'Ver smartphones', 's'))}'''
    return ('acessorios.html', 'Acessórios para celular na HG Smart', 'Capinhas, películas HG Fiber e HG Premium, carregadores, cabos, power banks, fones, caixas de som, Alexa e smartwatches nas lojas HG Smart.', corpo, 'acess')

# ═════════════════════════ SERVIÇOS ═════════════════════════
def p_servicos(r):
    pg4 = ''.join(f'''<a class="cartao item" href="{r}{p['id']}.html" data-r><span class="item-dado" aria-hidden="true">{p['num']}</span><h3>{p['nome']}</h3><p class="t3">{p['resumo']}</p></a>''' for p in PAGAMENTOS[:4])
    aprov = [('Mais de 5 financeiras', 'Cada uma com critério próprio. Se uma recusa, outra pode aprovar.'), ('Negativado no SPC e Serasa', 'O parcelamento no boleto atende quem está com restrição. Não é impedimento por aqui.'),
             ('Só RG e CNH', 'Processo simples e rápido, com análise facilitada e sem papelada.'), ('Sai no mesmo dia', 'Aparelhos disponíveis para levar na hora: Apple, Samsung, Motorola e Xiaomi entre as marcas.')]
    aprov_h = ''.join(f'<div class="cartao item" data-r><span class="item-n">{i + 1:02d}</span><h3>{t}</h3><p class="t3">{x}</p></div>' for i, (t, x) in enumerate(aprov))
    corpo = f'''{capa(r, '<span>Serviços</span>', 'Serviços · O que a rede faz', ['Três serviços.', 'Zero', 'burocracia.'], 'Serviços pensados para facilitar a vida: comprar um celular novo, equipar o que você já tem e conseguir aprovação onde normalmente não se consegue. Tudo com atendimento especializado e presencial.', lado='<span class="capa-dado" aria-hidden="true">03</span>')}
<section class="sec">
  <div class="wrap">
    {cab('01', 'Venda de celulares', ['Novos e seminovos,', 'com garantia', 'e procedência.'], sub='As principais marcas do mercado, e o estado do produto sempre declarado antes da compra.')}
    <div class="g4">{pg4}</div>
    <div class="acoes" data-r style="margin-top:3rem">{btn(r + 'lojas/index.html', 'Fazer a simulação presencial')}{btn(r + 'catalogo.html', 'Ver as marcas', 's')}</div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap duo">
    <div class="duo-fig">{foto(r, 'assets/lojas/caxias-do-sul/interior-3.webp', 'Parede de acessórios da loja de Caxias do Sul', 'r43')}</div>
    <div class="duo-txt">
      {cap('02', 'Acessórios e tecnologia')}
      {tit(['Para o celular', 'e para o', 'dia a dia.'])}
      <p class="t1" data-r>Linha completa para o seu celular e itens de tecnologia. Película e capinha saem aplicadas na loja, na hora.</p>
      <div data-r>{link(r + 'acessorios.html', 'Ver todos os acessórios')}</div>
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    {cab('03', 'Aprovação facilitada e pronta entrega', ['É aqui que', 'a rede se', 'diferencia.'], sub='Mais de cinco financeiras parceiras analisam o seu caso, o que aumenta bastante a chance de aprovação quando uma só diria não.')}
    <div class="g4">{aprov_h}</div>
    <p class="nota" data-r style="margin-top:1.5rem">Aprovação facilitada não significa aprovação garantida. A análise é responsável e transparente, justamente para você saber em que condição está comprando.</p>
  </div>
</section>
<section class="sec clara" id="troop">
  <div class="wrap duo">
    <div class="duo-txt">
      {cap('04', 'Telefonia · Troop Telecom')}
      {tit(['A operadora', 'do grupo,', 'dentro da loja.'])}
      <p class="t1" data-r>A Troop Telecom é a operadora de telefonia móvel do Grupo Hermes. Nas lojas HG Smart dá para contratar plano, ativar o chip, fazer portabilidade e recarga.</p>
      <div class="acoes" data-r>{btn(REDE['troop'], 'Conhecer a Troop Telecom', 's', ext=True)}</div>
      {pend('', 'Os planos e preços da Troop Telecom não estão no material recebido. Entram aqui quando forem enviados.', 'Planos · pendente')}
    </div>
    <div class="duo-fig"><figure class="foto" data-clip style="aspect-ratio:1280/493">{im(r, 'assets/img/banners/banner-7-desktop-1280.webp', 'Troop Telecom: liberte-se do plano caro')}</figure></div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap">
    {cap('05', 'Assistência técnica')}
    <div style="margin-top:1.5rem">{pend('', 'A assistência técnica aparece nas fachadas e no blog da rede (2024), mas não na página de serviços atual. Falta confirmar se o serviço segue ativo em 2026, em quais lojas e para quais reparos.', 'Assistência técnica · a confirmar')}</div>
  </div>
</section>
{chamada(r, ['A simulação', 'não custa', 'nada.'], 'Leva poucos minutos e você descobre a condição real antes de decidir qualquer coisa. Sem compromisso nenhum.', btn(r + 'lojas/index.html', 'Encontrar a loja mais perto') + btn(r + 'catalogo.html', 'Ver as marcas', 's'))}'''
    return ('servicos.html', 'Serviços da Rede HG Smart', 'Venda de celulares novos e seminovos, acessórios, aprovação facilitada com mais de 5 financeiras e Troop Telecom nas lojas HG Smart.', corpo, 'servicos')

# ═════════════════════════ GARANTIA ═════════════════════════
def p_garantia(r):
    corpo = f'''{capa(r, '<span>Garantia estendida</span>', 'Garantia estendida', ['Proteção', 'além da', 'garantia.'], 'Todo aparelho já sai com garantia. A estendida amplia esse prazo e a cobertura, e é contratada na própria loja.', acoes=btn(ZAP_REDE, 'Perguntar no WhatsApp', 'zap', ext=True, ico=ICO['zap']) + btn(r + 'lojas/index.html', 'Ver as 10 lojas', 's'), lado=foto(r, 'assets/lojas/cachoeira-do-sul/interior-2.webp', 'Vitrine de aparelhos na loja de Cachoeira do Sul', 'r45', lazy=False))}
<section class="sec">
  <div class="wrap">
    {cab('01', 'O que todo aparelho tem', ['Garantia oficial', 'e procedência,', 'sempre.'])}
    <div class="g3">
      <div class="cartao item" data-r><span class="item-n">01</span><h3>Garantia oficial</h3><p class="t3">Trabalhamos com as principais marcas do mercado, com garantia oficial de fábrica e procedência. Nada de origem duvidosa.</p></div>
      <div class="cartao item" data-r><span class="item-n">02</span><h3>Estado declarado</h3><p class="t3">Lacrado, seminovo ou usado: o estado do produto é sempre declarado com clareza antes da compra.</p></div>
      <div class="cartao item" data-r><span class="item-n">03</span><h3>Contratada na loja</h3><p class="t3">A garantia estendida é contratada junto com a compra, na própria unidade.</p></div>
    </div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap">
    {cap('02', 'Como funciona a estendida')}
    <div style="margin-top:1.5rem">{pend('B6', 'Falta tudo desta parte: prazo da garantia estendida, o que cobre e o que não cobre, preço ou percentual sobre o aparelho, e como se contrata. Também falta o prazo de garantia por categoria (novo, seminovo e usado). Não há nenhuma informação sobre garantia estendida no site antigo nem no briefing além do título.')}</div>
  </div>
</section>
{chamada(r, ['Dúvida sobre', 'a garantia?', 'Pergunte à loja.'], 'A equipe da unidade explica o que vale para o aparelho que você escolheu.', btn(r + 'lojas/index.html', 'Encontrar a loja mais perto') + btn(r + 'faq.html', 'Perguntas frequentes', 's'))}'''
    return ('garantia.html', 'Garantia estendida HG Smart', 'Todo aparelho da HG Smart sai com garantia. A garantia estendida amplia o prazo e a cobertura e é contratada na loja.', corpo, 'garantia')

# ═════════════════════════ FAQ ═════════════════════════
def p_faq(r):
    corpo = f'''{capa(r, '<span>FAQ</span>', 'Perguntas frequentes', ['As dúvidas', 'que todo mundo', 'tem.'], 'As perguntas que mais chegam nas lojas, respondidas sem rodeio. Se a sua não estiver aqui, chame no WhatsApp.', 'cvv', acoes=btn(ZAP_REDE, 'Perguntar no WhatsApp', 'zap', ext=True, ico=ICO['zap']), lado='<span class="capa-dado" aria-hidden="true">?</span>')}
<section class="sec">
  <div class="wrap faq-g">
    <div class="faq-esq">
      {cap('01', 'Nove perguntas')}
      {tit(['Pagamento,', 'loja e', 'garantia.'])}
      <p class="t2" data-r>As respostas valem para as dez unidades. A condição exata de cada compra sai da simulação presencial.</p>
    </div>
    <div class="faq-l" data-r>{faq_itens(FAQ, r, 'fq', grupos=True, pendencias=True)}</div>
  </div>
</section>
<section class="sec alt">
  <div class="wrap">{pend('', 'O JSON-LD de FAQPage só entra quando todas as respostas estiverem fechadas. Publicar schema com resposta incompleta é pior que não ter schema: o Google penaliza marcação que não corresponde ao conteúdo visível.', 'Conteúdo pendente · FAQPage schema')}</div>
</section>
{chamada(r, ['Ficou alguma', 'dúvida?', 'Chame a loja.'], 'Cada unidade tem WhatsApp próprio. Para assunto de loja, o mais rápido é falar direto com ela.', btn(r + 'lojas/index.html', 'Ver as 10 lojas') + btn(r + 'contato.html', 'Outros canais', 's'))}'''
    return ('faq.html', 'Perguntas frequentes da HG Smart', 'Boleto, conta de luz, Crédito CLT, negativado, documentos, simulação, lojas, garantia e troca do usado: as dúvidas mais comuns sobre a HG Smart.', corpo, 'faq')

# ═════════════════════════ CONTATO ═════════════════════════
def p_contato(r):
    ops = ''.join('<option value="%s">%s</option>' % (l['id'], l['cidade']) for l in LOJAS)
    lojas = ''.join(f'''<a href="{wa(l['zaps'][0], 'Olá! Vim pelo site da HG Smart e quero falar com a loja de %s.' % l['cidade'])}" target="_blank" rel="noopener"><b>{l['cidade']}</b><span>{l['zaps'][0]}</span></a>''' for l in LOJAS)
    redes = [('Instagram', '@hgsmart_', REDE['insta']), ('Facebook', 'Rede HG Smart', REDE['face']), ('TikTok', '@hg.smart', REDE['tiktok']), ('YouTube', '@hgsmartlojadecelulares', REDE['youtube'])]
    redes_h = ''.join(f'<a class="cartao mini" href="{u}" target="_blank" rel="noopener" data-r><span class="rotulo">{n}</span><b>{h}</b></a>' for n, h, u in redes)
    fones = ''.join(f'<div class="copiavel"><span>{f}</span><button class="copiar" type="button" data-copiar="{f}">Copiar</button></div>' for f in REDE['fones'])
    corpo = f'''{capa(r, '<span>Contato</span>', 'Contato', ['Fale com', 'a gente.'], 'Cada unidade tem WhatsApp próprio. Para assunto de loja, o mais rápido é falar direto com ela.', 'ca', lado='<span class="capa-dado" aria-hidden="true">Oi</span>')}
<section class="sec">
  <div class="wrap duo fixo">
    <div class="duo-txt">
      {cap('01', 'Mensagem pronta')}
      {tit(['Escolha a loja.', 'A mensagem', 'já vai escrita.'])}
      <p class="t1" data-r>Diga qual unidade e qual o assunto. O botão abre o WhatsApp daquela loja com a mensagem montada.</p>
    </div>
    <form class="cartao item" id="msgForm" data-r>
      <div class="campo"><label for="msgLoja">Loja</label><select id="msgLoja">{ops}</select></div>
      <div class="campo"><label for="msgAssunto">Assunto</label><select id="msgAssunto"><option>Quero fazer uma simulação</option><option>Quero saber se um modelo está disponível</option><option>Dúvida sobre formas de pagamento</option><option>Dúvida sobre garantia</option><option>Quero avaliar meu celular usado</option><option>Outro assunto</option></select></div>
      <div class="campo"><label for="msgNome">Seu nome (opcional)</label><input id="msgNome" type="text" autocomplete="given-name"></div>
      <div class="campo"><label for="msgTexto">Mensagem (opcional)</label><textarea id="msgTexto" rows="3"></textarea></div>
      <p class="t3" id="msgPrevia" aria-live="polite"></p>
      <a class="btn btn-zap" id="msgEnviar" href="{ZAP_REDE}" target="_blank" rel="noopener">{ICO['zap']}Abrir no WhatsApp</a>
    </form>
  </div>
</section>
<section class="sec alt">
  <div class="wrap">
    {cab('02', 'WhatsApp por loja', ['Dez unidades,', 'dez números', 'diretos.'], sub='Algumas lojas têm mais de um número. A lista completa está na página de cada unidade.')}
    <div class="disp contato-lj" data-r>{lojas}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap g2">
    <div class="pilha">
      {cap('03', 'E-mail e telefones')}
      <div class="campo" data-r><span class="rotulo">E-mail</span><div class="copiavel"><span>{REDE['email']}</span><button class="copiar" type="button" data-copiar="{REDE['email']}">Copiar</button></div></div>
      <div class="campo" data-r><span class="rotulo">Telefones da matriz</span>{fones}</div>
      <div class="campo" data-r><span class="rotulo">Matriz</span><p class="t2">{REDE['matriz'][0]} · {REDE['matriz'][1]}<br>{REDE['matriz'][2]} · {REDE['matriz'][3]}<br>{REDE['razao']} · CNPJ {REDE['cnpj']}</p></div>
    </div>
    <div class="pilha">
      {cap('04', 'Redes sociais')}
      <div class="mini-g">{redes_h}</div>
      {pend('B13', 'Faltam o formulário e a abertura de ticket. Num site estático o formulário precisa de serviço externo (Formspree, Netlify Forms) ou endpoint próprio, e o ticket precisa definir se é sistema próprio, Zendesk ou apenas e-mail. É decisão de infraestrutura, não de layout. Enquanto isso, a mensagem pronta acima leva o cliente direto ao WhatsApp da loja.')}
    </div>
  </div>
</section>'''
    return ('contato.html', 'Contato da Rede HG Smart', 'Fale com a HG Smart: WhatsApp de cada uma das dez lojas, e-mail, telefones da matriz e redes sociais.', corpo, 'contato')

# ═════════════════════════ LEGAIS E 404 ═════════════════════════
def _legal(r, arq, tit3, lead, itens, titulo, desc):
    fic = ''.join(f'<div><dt>{a}</dt><dd>{b}</dd></div>' for a, b in itens)
    corpo = f'''{capa(r, '<span>%s</span>' % titulo.split(' — ')[0], titulo.split(' — ')[0], tit3, lead, 'ca', so=True)}
<section class="sec">
  <div class="wrap pilha-l">
    <dl class="ficha" data-r>{fic}</dl>
    {pend('B12', 'Este texto é um esqueleto, NÃO é documento jurídico válido. Política de Privacidade, Termos de Uso e Política de Cookies precisam de redação por advogado, cobrindo LGPD, base legal do tratamento, prazo de retenção e canal do titular. Não publique como está.')}
  </div>
</section>'''
    return (arq, titulo.split(' — ')[0] + ' da HG Smart', desc, corpo, '')

def p_privacidade(r):
    return _legal(r, 'politica-de-privacidade.html', ['Política de', 'Privacidade.'], 'Como tratamos os dados de quem visita o site e de quem compra nas lojas.',
                  [('Quais dados coletamos', 'A definir por assessoria jurídica.'), ('Para que usamos', 'A definir por assessoria jurídica.'), ('Com quem compartilhamos', 'A definir. Inclui as financeiras parceiras na análise de crédito.'),
                   ('Seus direitos (LGPD)', 'A definir por assessoria jurídica.'), ('Cookies e medição', 'A definir. Depende de quais ferramentas entram (GA4, GTM, Pixel Meta).')], 'Política de Privacidade — HG Smart', 'Política de Privacidade da Rede HG Smart.')
def p_termos(r):
    return _legal(r, 'termos-de-uso.html', ['Termos', 'de Uso.'], 'As condições para uso deste site.',
                  [('Objeto', 'A definir por assessoria jurídica.'), ('Natureza informativa do conteúdo', 'A definir. É importante deixar claro que as condições exibidas são referência e não proposta firme.'),
                   ('Propriedade intelectual', 'A definir por assessoria jurídica.'), ('Limitação de responsabilidade', 'A definir por assessoria jurídica.')], 'Termos de Uso — HG Smart', 'Termos de Uso do site da Rede HG Smart.')
def p_cookies(r):
    return _legal(r, 'politica-de-cookies.html', ['Política', 'de Cookies.'], 'O que é guardado no seu navegador quando você visita este site.',
                  [('O que o site usa hoje', 'O site em si não grava cookie nenhum: é estático e não tem login, carrinho nem sessão. Para lembrar que a abertura já foi exibida, ele guarda uma marca na sessão do navegador, que some ao fechar a aba.'),
                   ('Conteúdo de terceiros', 'Links para o Google Maps, o WhatsApp e o Instagram abrem nas plataformas de cada serviço, sob as políticas delas.'), ('Cookies necessários', 'A definir por assessoria jurídica.'),
                   ('Cookies de medição e marketing', 'A definir. Depende de quais ferramentas entram. O briefing pede Google Analytics 4, Google Tag Manager e Pixel Meta; os três gravam cookies e precisam ser declarados aqui nominalmente.'),
                   ('Como gerenciar ou recusar', 'A definir por assessoria jurídica.')], 'Política de Cookies — HG Smart', 'Política de Cookies do site da Rede HG Smart.')

def p_404(r):
    ata = [('boleto.html', 'Celular no boleto', 'Sem cartão e sem conta em banco.'), ('conta-de-luz.html', 'Conta de luz', 'Até 24x, sem entrada.'), ('lojas/index.html', 'Lojas da rede', 'Endereço, horário e WhatsApp das 10 unidades.'),
           ('faq.html', 'Perguntas frequentes', 'Documentos, negativado, simulação e garantia.'), ('catalogo.html', 'Marcas', 'O que as lojas da rede trabalham.'), ('contato.html', 'Contato', 'WhatsApp, e-mail e redes da rede.')]
    ata_h = ''.join(f'<a class="cartao item" href="{r}{h}" data-r><h3>{t}</h3><p class="t3">{x}</p></a>' for h, t, x in ata)
    corpo = f'''<section class="capa"><div class="wrap capa-g">
  <div class="capa-txt">{cap('', 'Erro 404')}{tit(['Esta página', 'não existe.'], 'ca', 'h1', 'd1')}<p class="t1" data-r>O endereço pode ter mudado ou o link estar errado. As lojas continuam todas aqui, e quem atende também.</p>
  <div class="acoes" data-r>{btn(r + 'lojas/index.html', 'Ver as 10 lojas')}{btn(r + 'como-comprar.html', 'Formas de pagamento', 's')}{btn(home(r), 'Ir para o início', 's')}</div></div>
  <div class="capa-lado"><span class="erro-num" aria-hidden="true">404</span></div>
</div></section>
<section class="sec"><div class="wrap">{cab('', 'O que costuma ser procurado', ['Talvez seja', 'uma destas.'], 'ca')}<div class="g3">{ata_h}</div></div></section>'''
    return ('404.html', 'Página não encontrada', 'Página não encontrada no site da Rede HG Smart.', corpo, '')
