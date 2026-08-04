/**
 * Gera as páginas que o briefing pede e que ainda não existiam.
 *
 * Por que um gerador e não 7 arquivos escritos à mão: cabeçalho, menu
 * mobile, rodapé, botão de WhatsApp e a lista de scripts são idênticos em
 * toda página. Duplicar isso 12 vezes garante que um dia alguém edite o
 * menu em 11 lugares e esqueça o 12º.
 *
 * ATENÇÃO: as 5 páginas originais (index, quem-somos, catalogo, servicos,
 * lojas) ainda têm o cabeçalho e o rodapé embutidos à mão. Unificá-las
 * neste gerador é a próxima limpeza — está anotado no README.
 *
 * Uso: npm run paginas
 */

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const DOMINIO = 'https://hgsmart.com.br';
const ZAP_MATRIZ = '5551998575806';

/* Navegação — um só lugar */
const MENU = [
  { url: 'index.html', rotulo: 'Início' },
  { url: 'quem-somos.html', rotulo: 'A rede' },
  { url: 'catalogo.html', rotulo: 'Marcas' },
  { url: 'como-comprar.html', rotulo: 'Como comprar' },
  { url: 'lojas.html', rotulo: 'Lojas' },
];

const RODAPE_INSTITUCIONAL = [
  ['index.html', 'Início'],
  ['quem-somos.html', 'A rede'],
  ['ceo.html', 'Conheça o CEO'],
  ['catalogo.html', 'Marcas'],
  ['servicos.html', 'Serviços'],
  ['como-comprar.html', 'Como comprar'],
  ['garantia.html', 'Garantia estendida'],
  ['lojas.html', 'Lojas'],
  ['faq.html', 'Perguntas frequentes'],
  ['contato.html', 'Contato'],
];

const REDES = [
  ['https://www.instagram.com/redehgsmart/', 'Instagram'],
  ['https://www.facebook.com/redehgsmart/', 'Facebook'],
  ['https://www.youtube.com/@redehgsmart', 'YouTube'],
  ['https://www.tiktok.com/@redehgsmart', 'TikTok'],
];

const TELEFONES = [
  ['+5551998575806', '(51) 9 9857-5806'],
  ['+5551920035624', '(51) 9 2003-5624'],
  ['+5551990178584', '(51) 9 9017-8584'],
];

/* ─── Marcador de pendência: vira um aviso visível na própria página ─── */
function pendencia(codigo, texto) {
  return `        <aside class="cartao cartao-azul mt-10 p-7" data-pendencia="${codigo}">
          <p class="rotulo">Conteúdo pendente · ${codigo}</p>
          <p class="mt-3 text-sm leading-relaxed">${texto}</p>
        </aside>`;
}

function cabecalho(atual) {
  const itens = MENU.map(
    (m) =>
      `          <a class="link-sub text-sm ${
        m.url === atual ? 'text-branco" href="' + m.url + '" aria-current="page' : 'text-prata hover:text-branco" href="' + m.url + ''
      }">${m.rotulo}</a>`
  ).join('\n');

  const mobile = MENU.map(
    (m) =>
      `        <a class="border-b border-branco/10 py-5 text-4xl ${
        m.url === atual ? 'text-azul' : 'text-branco'
      }" href="${m.url}">${m.rotulo}</a>`
  ).join('\n');

  return `    <header class="cabecalho fixed inset-x-0 top-0 z-50 border-b border-transparent" data-cabecalho>
      <div class="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-5 lg:px-10">
        <a href="index.html" class="flex items-center gap-3" aria-label="Rede HG Smart — página inicial">
          <img src="assets/img/icones/LOGO.png" alt="Logo da Rede HG Smart" width="132" height="36" class="h-8 w-auto" />
        </a>
        <nav aria-label="Navegação principal" class="hidden items-center gap-9 lg:flex">
${itens}
        </nav>
        <a href="lojas.html" class="btn btn-azul hidden lg:inline-flex">Ver as lojas</a>
        <button type="button" class="flex size-11 items-center justify-center rounded-full border border-branco/20 lg:hidden" data-menu-botao aria-expanded="false" aria-controls="menu-mobile" aria-label="Abrir menu">
          <span class="sr-only">Menu</span>
          <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round" /></svg>
        </button>
      </div>
    </header>

    <div id="menu-mobile" class="menu-mobile fixed inset-0 z-40 overflow-y-auto bg-preto px-6 pb-10 pt-28 lg:hidden" data-menu-mobile data-aberto="false">
      <nav aria-label="Navegação mobile" class="flex flex-col gap-2">
${mobile}
      </nav>
      <a href="lojas.html" class="btn btn-azul mt-10 w-full">Ver as lojas</a>
    </div>`;
}

/* O rodapé vem de aplicar-rodape.js — fonte única para as 13 páginas.
   Antes existia uma cópia aqui, e as duas divergiram na primeira vez
   que o rodapé mudou. */
const { rodape } = require('./aplicar-rodape');

function pagina({ arquivo, titulo, descricao, url, rotulo, h1, intro, corpo, schema, atual }) {
  return `<!doctype html>
<html lang="pt-BR" class="scroll-smooth">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>${titulo}</title>
    <meta name="description" content="${descricao}" />
    <link rel="canonical" href="${DOMINIO}/${url}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Rede HG Smart" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:url" content="${DOMINIO}/${url}" />
    <meta property="og:title" content="${titulo}" />
    <meta property="og:description" content="${descricao}" />
    <meta property="og:image" content="${DOMINIO}/assets/img/fotos/fachada1.jpg" />
    <meta property="og:image:alt" content="Fachada de uma loja da Rede HG Smart" />
    <meta name="twitter:card" content="summary_large_image" />

    <meta name="theme-color" content="#000000" />
    <link rel="icon" href="assets/img/icones/FAVICON.png" />
    <link rel="preload" href="assets/fontes/BebasNeue-400.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="assets/fontes/Inter-variavel.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="assets/css/site.css" />
${schema ? `\n    <script type="application/ld+json">\n${schema}\n    </script>\n` : ''}  </head>

  <body class="antialiased">
    <div class="progresso" data-progresso aria-hidden="true"></div>
    <a href="#conteudo" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70 focus:rounded-full focus:bg-azul focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white">Ir para o conteúdo</a>

${cabecalho(atual || arquivo)}

    <main id="conteudo">
      <!-- ══════ ABERTURA ══════ -->
      <section class="granulado relative overflow-hidden pb-16 pt-40 lg:pb-20 lg:pt-52" data-hero>
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <div class="absolute -left-[14%] top-[-26%] size-[54rem] halo-azul opacity-35"></div>
          <div class="absolute -right-[12%] bottom-[-34%] size-[42rem] halo-fundo opacity-20"></div>
        </div>

        <div class="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
          <p class="filete-rotulo rotulo mb-8 opacity-0" data-hero-secundario style="transform: translateY(16px)">${rotulo}</p>
          <h1 class="texto-grande titulo-na-grade max-w-4xl text-branco">
${h1}
          </h1>
          <p class="mt-10 max-w-2xl text-lg leading-relaxed text-prata opacity-0" data-hero-secundario style="transform: translateY(16px)">
            ${intro}
          </p>
        </div>
      </section>

${corpo}
    </main>

${rodape()}

    <!-- Botão fixo de WhatsApp -->
    <a class="zap-fixo" href="https://wa.me/${ZAP_MATRIZ}?text=${encodeURIComponent(
    'Olá! Vim pelo site da HG Smart e gostaria de saber mais sobre as condições de pagamento.'
  )}" target="_blank" rel="noopener noreferrer" aria-label="Falar com a HG Smart no WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.68-2.09-.17-.3-.02-.46.13-.61.15-.15.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.62-.93-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.06 4.37.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.77.46 3.43 1.27 4.87L2 22l5.28-1.26A9.94 9.94 0 0 0 12.02 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.2c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3.2.77.79-3.12-.2-.32A8.16 8.16 0 0 1 3.82 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2Z" />
      </svg>
      <span>Falar no WhatsApp</span>
    </a>

    <script src="assets/vendor/lenis.min.js" defer></script>
    <script src="assets/vendor/gsap.min.js" defer></script>
    <script src="assets/vendor/ScrollTrigger.min.js" defer></script>
    <script src="assets/js/site.js" defer></script>
    <script src="assets/js/banner.js" defer></script>
    <script src="assets/js/motion.js" defer></script>
  </body>
</html>
`;
}

/* ═══════════════════════════════════════════════════════════════
   CONTEÚDO DAS PÁGINAS
   ═══════════════════════════════════════════════════════════════ */

const FAQ = [
  {
    p: 'Como funciona a compra no boleto?',
    r: 'O parcelamento no boleto dispensa cartão de crédito e conta em banco. A análise é feita na loja, com RG e CNH, e as parcelas vêm por boleto.',
    pendente: 'B1 — confirmar o número de parcelas (a arte do banner diz 18x, a página de Serviços diz 25x) e se há entrada.',
  },
  {
    p: 'Como funciona o parcelamento na conta de luz?',
    r: 'A parcela do celular entra junto com a sua fatura de energia, em até 24 vezes. Disponível nas cidades atendidas pela RGE.',
    pendente: 'B2 — o briefing diz "sem entrada". Confirmar.',
  },
  {
    p: 'Como funciona o Crédito CLT?',
    r: '',
    pendente: 'B4 — parcelas, regra e público-alvo. Não há nenhuma informação sobre isso no site antigo.',
  },
  {
    p: 'Posso comprar estando negativado?',
    r: 'Sim. O parcelamento no boleto atende quem está com restrição no SPC e no Serasa. A rede trabalha com mais de cinco financeiras parceiras, cada uma com critério próprio — se uma recusa, outra pode aprovar. Aprovação facilitada não é aprovação garantida: a análise é feita caso a caso.',
  },
  {
    p: 'Quais documentos preciso levar?',
    r: 'RG e CNH bastam para a simulação. Não é preciso comprovante de renda nem papelada extra.',
  },
  {
    p: 'Como faço uma simulação?',
    r: 'A simulação é presencial, em qualquer uma das dez unidades, e leva poucos minutos. Você descobre a condição real antes de decidir qualquer coisa, sem compromisso.',
  },
  {
    p: 'Como encontro a loja mais próxima?',
    r: 'A página de <a class="link-sub text-azul" href="lojas.html">Lojas</a> tem as dez unidades com endereço, horário, WhatsApp e link de rota. Duas delas — Cachoeirinha e Capão da Canoa — abrem no domingo.',
  },
  {
    p: 'Como funciona a garantia?',
    r: 'Todos os aparelhos têm garantia, e o estado do produto (lacrado, seminovo ou usado) é sempre declarado antes da compra.',
    pendente: 'B6 — prazo por categoria e as regras da garantia estendida.',
  },
  {
    p: 'Como funciona a troca do celular usado?',
    r: '',
    pendente: 'B5 — como é a avaliação do aparelho, se abate na entrada ou no total.',
  },
];

function corpoFaq() {
  const itens = FAQ.map(
    (f, i) => `          <details class="cartao group p-7" ${i === 0 ? 'open' : ''}>
            <summary class="cursor-pointer text-xl text-branco marker:content-none [&::-webkit-details-marker]:hidden">
              ${f.p}
            </summary>
            <div class="mt-5 text-sm leading-relaxed text-prata">
              ${f.r || '<em class="text-cinza">Resposta a definir.</em>'}
            </div>
${f.pendente ? `            <p class="mt-5 rounded-xl border border-azul/40 bg-azul/10 p-4 text-xs leading-relaxed text-azul">Pendente: ${f.pendente}</p>` : ''}          </details>`
  ).join('\n');

  return `      <section class="secao-clara relative overflow-hidden" aria-labelledby="titulo-faq">
        <div class="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
          <h2 id="titulo-faq" class="sr-only">Perguntas frequentes</h2>
          <div class="mx-auto flex max-w-3xl flex-col gap-4">
${itens}
          </div>
${pendencia(
    'FAQPage schema',
    'O JSON-LD de FAQPage só entra quando todas as respostas estiverem fechadas. Publicar schema com resposta vazia é pior que não ter schema — o Google penaliza marcação que não corresponde ao conteúdo visível.'
  )}
        </div>
      </section>`;
}

function corpoComoComprar() {
  const formas = [
    ['Pix à vista', 'Com desconto no valor. É a forma mais barata de fechar.', null],
    ['Cartão de crédito', 'Em até 10 vezes, para quem já tem limite disponível.', 'B3 — confirmar se é sem juros, como diz o briefing.'],
    ['Boleto', 'Sem cartão e sem conta em banco. Atende quem está negativado.', 'B1 — 18x ou 25x? Tem entrada?'],
    ['Conta de luz', 'A parcela entra na fatura de energia, em até 24 vezes. Cidades RGE.', 'B2 — confirmar "sem entrada".'],
    ['Crédito CLT', '', 'B4 — não existe nenhuma informação sobre isso no material atual.'],
    ['Troca do usado', '', 'B5 — como é a avaliação e como abate no valor.'],
  ];

  const cards = formas
    .map(
      ([t, d, pend], i) => `            <article class="cartao ${i === 2 ? 'cartao-azul' : ''} p-8">
              <p class="rotulo">0${i + 1}</p>
              <h3 class="mt-4 text-xl">${t}</h3>
              <p class="mt-3 text-sm leading-relaxed">${d || '<em>A definir.</em>'}</p>
${pend ? `              <p class="mt-4 border-t border-current/20 pt-4 text-xs leading-relaxed opacity-80">Pendente: ${pend}</p>` : ''}            </article>`
    )
    .join('\n');

  return `      <section class="relative overflow-hidden" aria-labelledby="titulo-formas">
        <div class="pointer-events-none absolute inset-0" aria-hidden="true">
          <p class="numero-fantasma -right-6 top-0 lg:right-4">01</p>
        </div>
        <div class="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
          <h2 id="titulo-formas" class="filete-rotulo rotulo mb-12">Seis caminhos</h2>
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal-grupo>
${cards}
          </div>
        </div>
      </section>`;
}

function corpoSimples(rotuloSecao, blocos, pendencias) {
  const conteudo = blocos
    .map(
      (b) => `            <article class="cartao p-8">
              <h3 class="text-xl text-branco">${b.t}</h3>
              <p class="mt-3 text-sm leading-relaxed text-prata">${b.d}</p>
            </article>`
    )
    .join('\n');

  return `      <section class="secao-clara relative overflow-hidden" aria-labelledby="titulo-secao">
        <div class="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
          <h2 id="titulo-secao" class="filete-rotulo rotulo mb-12">${rotuloSecao}</h2>
${conteudo ? `          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal-grupo>\n${conteudo}\n          </div>` : ''}
${pendencias.map((p) => pendencia(p.codigo, p.texto)).join('\n')}
        </div>
      </section>`;
}

function corpoLegal(secoes) {
  return `      <section class="secao-clara relative overflow-hidden">
        <div class="relative z-10 mx-auto max-w-3xl px-6 py-24 lg:px-10">
${secoes
    .map(
      (s) => `          <h2 class="texto-medio mt-14 text-branco first:mt-0">${s.t}</h2>
          <p class="mt-5 text-base leading-relaxed text-prata">${s.d}</p>`
    )
    .join('\n')}
${pendencia(
    'B12',
    'Este texto é um esqueleto, NÃO é documento jurídico válido. Política de Privacidade e Termos de Uso precisam de redação por advogado, cobrindo LGPD, base legal do tratamento, prazo de retenção e canal do titular. Não publique como está.'
  )}
        </div>
      </section>`;
}

/* ═══════════════════════════════════════════════════════════════ */

const PAGINAS = [
  {
    arquivo: 'como-comprar.html',
    url: 'como-comprar',
    titulo: 'Como comprar — Formas de pagamento da Rede HG Smart',
    descricao:
      'Todas as formas de pagar seu celular na HG Smart: Pix, cartão, boleto para negativados, conta de luz, Crédito CLT e troca do usado.',
    rotulo: 'Como comprar',
    h1: '            <span class="linha-mask"><span>Seis formas</span></span>\n            <span class="linha-mask"><span class="texto-contorno">de sair com</span></span>\n            <span class="linha-mask"><span class="text-azul">o celular novo.</span></span>',
    intro:
      'Cada bolso tem um caminho. A simulação é presencial e sem compromisso — você descobre a condição real antes de decidir.',
    corpo: corpoComoComprar(),
  },
  {
    arquivo: 'faq.html',
    url: 'faq',
    titulo: 'Perguntas frequentes — Rede HG Smart',
    descricao:
      'Dúvidas sobre boleto, conta de luz, Crédito CLT, compra para negativados, documentos, simulação, garantia e troca do usado na Rede HG Smart.',
    rotulo: 'Perguntas frequentes',
    h1: '            <span class="linha-mask"><span>As dúvidas</span></span>\n            <span class="linha-mask"><span class="text-azul">que todo mundo tem.</span></span>',
    intro:
      'As perguntas que mais chegam nas lojas, respondidas sem rodeio. Se a sua não estiver aqui, chame no WhatsApp.',
    corpo: corpoFaq(),
  },
  {
    arquivo: 'garantia.html',
    url: 'garantia',
    titulo: 'Garantia estendida — Rede HG Smart',
    descricao:
      'Como funciona a garantia estendida da Rede HG Smart: cobertura, benefícios e como contratar na loja.',
    rotulo: 'Garantia estendida',
    h1: '            <span class="linha-mask"><span>Proteção</span></span>\n            <span class="linha-mask"><span class="text-azul">além da garantia.</span></span>',
    intro:
      'Todo aparelho já sai com garantia. A estendida amplia esse prazo e a cobertura — e é contratada na própria loja.',
    corpo: corpoSimples(
      'Como funciona',
      [],
      [
        {
          codigo: 'B6',
          texto:
            'Falta tudo desta página: prazo da garantia estendida, o que cobre e o que não cobre, preço ou percentual sobre o aparelho, e como se contrata. Não há nenhuma informação sobre garantia estendida no site antigo nem no briefing além do título.',
        },
      ]
    ),
  },
  {
    arquivo: 'ceo.html',
    url: 'ceo',
    titulo: 'Conheça o CEO — Eduardo Hermes, fundador da Rede HG Smart',
    descricao:
      'A história de Eduardo Hermes, fundador da Rede HG Smart, e a expansão da rede pelo Rio Grande do Sul.',
    rotulo: 'Conheça o CEO',
    h1: '            <span class="linha-mask"><span>Eduardo</span></span>\n            <span class="linha-mask"><span class="text-azul">Hermes.</span></span>',
    intro: 'Quem começou, por quê, e para onde a rede vai.',
    corpo: corpoSimples(
      'A história',
      [],
      [
        {
          codigo: 'B9',
          texto:
            'Falta o texto sobre Eduardo Hermes (fundação, trajetória, expansão) e o vídeo institucional que o briefing pede. Também precisa de uma foto dele autorizada para uso no site — a imagem que está no hero da home é provavelmente ele, e o uso precisa da confirmação dele.',
        },
      ]
    ),
  },
  {
    arquivo: 'contato.html',
    url: 'contato',
    titulo: 'Contato — Fale com a Rede HG Smart',
    descricao:
      'Telefones, WhatsApp e redes sociais da Rede HG Smart. Dez unidades no Rio Grande do Sul.',
    rotulo: 'Contato',
    h1: '            <span class="linha-mask"><span>Fale com</span></span>\n            <span class="linha-mask"><span class="text-azul">a gente.</span></span>',
    intro:
      'Cada unidade tem WhatsApp próprio — para assunto de loja, o mais rápido é falar direto com ela.',
    corpo: corpoSimples(
      'Canais',
      [
        {
          t: 'WhatsApp por loja',
          d: 'As dez unidades têm número próprio — algumas têm mais de um. A lista completa está na página de <a class="link-sub text-azul" href="lojas.html">Lojas</a>.',
        },
        {
          t: 'E-mail',
          d: '<a class="link-sub text-azul" href="mailto:contato@hgsmart.com.br">contato@hgsmart.com.br</a>',
        },
        {
          t: 'Telefones',
          d: '(51) 9 9857-5806 · (51) 9 2003-5624 · (51) 9 9017-8584',
        },
        {
          t: 'Redes sociais',
          d: 'Instagram, Facebook, YouTube e TikTok — links no rodapé.',
        },
      ],
      [
        {
          codigo: 'B13',
          texto:
            'Faltam o formulário e a abertura de ticket. Num site estático o formulário precisa de serviço externo (Formspree, Netlify Forms) ou endpoint próprio — e o ticket precisa definir se é sistema próprio, Zendesk ou apenas e-mail. É decisão de infraestrutura, não de layout.',
        },
      ]
    ),
  },
  {
    arquivo: 'politica-de-privacidade.html',
    url: 'politica-de-privacidade',
    titulo: 'Política de Privacidade — Rede HG Smart',
    descricao: 'Como a Rede HG Smart trata os dados pessoais de clientes e visitantes do site.',
    rotulo: 'Política de Privacidade',
    h1: '            <span class="linha-mask"><span>Política de</span></span>\n            <span class="linha-mask"><span class="text-azul">Privacidade.</span></span>',
    intro: 'Como tratamos os dados de quem visita o site e de quem compra nas lojas.',
    atual: null,
    corpo: corpoLegal([
      { t: 'Quais dados coletamos', d: 'A definir por assessoria jurídica.' },
      { t: 'Para que usamos', d: 'A definir por assessoria jurídica.' },
      { t: 'Com quem compartilhamos', d: 'A definir — inclui as financeiras parceiras na análise de crédito.' },
      { t: 'Seus direitos (LGPD)', d: 'A definir por assessoria jurídica.' },
      { t: 'Cookies e medição', d: 'A definir — depende de quais ferramentas entram (GA4, GTM, Pixel Meta).' },
    ]),
  },
  {
    arquivo: 'termos-de-uso.html',
    url: 'termos-de-uso',
    titulo: 'Termos de Uso — Rede HG Smart',
    descricao: 'Condições de uso do site institucional da Rede HG Smart.',
    rotulo: 'Termos de Uso',
    h1: '            <span class="linha-mask"><span>Termos</span></span>\n            <span class="linha-mask"><span class="text-azul">de Uso.</span></span>',
    intro: 'As condições para uso deste site.',
    corpo: corpoLegal([
      { t: 'Objeto', d: 'A definir por assessoria jurídica.' },
      { t: 'Natureza informativa do conteúdo', d: 'A definir — importante deixar claro que preços e condições exibidos são referência e não proposta firme.' },
      { t: 'Propriedade intelectual', d: 'A definir por assessoria jurídica.' },
      { t: 'Limitação de responsabilidade', d: 'A definir por assessoria jurídica.' },
    ]),
  },
  {
    arquivo: 'politica-de-cookies.html',
    url: 'politica-de-cookies',
    titulo: 'Política de Cookies — Rede HG Smart',
    descricao: 'Quais cookies o site da Rede HG Smart utiliza e como gerenciá-los.',
    rotulo: 'Política de Cookies',
    h1: '            <span class="linha-mask"><span>Política</span></span>\n            <span class="linha-mask"><span class="text-azul">de Cookies.</span></span>',
    intro: 'O que é guardado no seu navegador quando você visita este site.',
    corpo: corpoLegal([
      {
        t: 'O que o site usa hoje',
        d: 'Nenhum cookie é gravado por este site no momento. Ele é estático e não tem login, carrinho nem sessão. Isso muda assim que as ferramentas de medição entrarem.',
      },
      { t: 'Cookies necessários', d: 'A definir por assessoria jurídica.' },
      {
        t: 'Cookies de medição e marketing',
        d: 'A definir — depende de quais ferramentas entram. O briefing pede Google Analytics 4, Google Tag Manager e Pixel Meta; os três gravam cookies e precisam ser declarados aqui nominalmente.',
      },
      { t: 'Como gerenciar ou recusar', d: 'A definir por assessoria jurídica.' },
    ]),
  },
];

console.log('\n  Gerando páginas\n');
for (const p of PAGINAS) {
  fs.writeFileSync(path.join(RAIZ, p.arquivo), pagina(p), 'utf8');
  const kb = Math.round(fs.statSync(path.join(RAIZ, p.arquivo)).size / 1024);
  console.log(`  ${p.arquivo.padEnd(30)} ${String(kb).padStart(3)}KB`);
}
console.log('');
