/**
 * Casca comum das páginas geradas: <head>, cabeçalho, menu mobile,
 * botão fixo de WhatsApp, scripts e o marcador de pendência.
 *
 * POR QUE ESTE ARQUIVO EXISTE
 * Isto morava dentro de ferramentas/gerar-paginas.js. Quando surgiu o
 * segundo gerador (gerar-lojas.js, as páginas de unidade), copiar a casca
 * para lá repetiria o erro que o comentário do rodapé já registra: duas
 * cópias divergem na primeira vez que uma delas muda.
 *
 * E não dava para simplesmente `require('./gerar-paginas')`: aquele arquivo
 * escreve as 8 páginas institucionais no topo do módulo, então importá-lo
 * para pegar uma função teria o efeito colateral de regerar tudo.
 *
 * ─── O PARÂMETRO `prefixo` ───
 * As páginas institucionais ficam na raiz e usam caminho relativo puro
 * (`assets/…`, `index.html`). As páginas de unidade ficam em
 * `lojas/<id>/index.html`, dois níveis abaixo, e o índice em
 * `lojas/index.html`, um nível abaixo. Os mesmos caminhos quebrariam lá.
 *
 * Então todo caminho RELATIVO recebe `prefixo`:
 *
 *     raiz              prefixo = ''         assets/css/site.css
 *     lojas/index.html  prefixo = '../'      ../assets/css/site.css
 *     lojas/<id>/       prefixo = '../../'   ../../assets/css/site.css
 *
 * O que NÃO leva prefixo, por já ser absoluto: canonical, og:url,
 * og:image, os @id/url do JSON-LD, wa.me, tel:, mailto: e redes sociais.
 * Prefixar um desses geraria URL inválida no que o Google indexa.
 */

const DOMINIO = 'https://hgsmart.com.br';
const ZAP_MATRIZ = '5551998575806';

/* Navegação — um só lugar.
   `lojas/` (e não `lojas.html`) porque o índice das unidades passou a ser
   lojas/index.html. Ver o comentário de rota em gerar-seo.js. */
/* O MENU é fonte única para as 23 páginas — as geradas o recebem daqui, e
   as 5 escritas à mão são sincronizadas por `npm run menu`.

   Antes disso os dois grupos divergiam: as 5 antigas mostravam "Serviços"
   e as 18 geradas mostravam "Como comprar". Quem entrava por uma página
   de unidade nunca encontrava Serviços; quem entrava pela home nunca
   encontrava Como comprar. Metade do site escondia metade do site.

   Sete itens é o teto para caber numa linha no desktop. O resto do mapa
   vive na coluna "Institucional" do rodapé, que é gerada por
   aplicar-rodape.js e alcança as mesmas 23 páginas. */
const MENU = [
  { url: 'index.html', rotulo: 'Início' },
  { url: 'quem-somos.html', rotulo: 'Quem Somos' },
  { url: 'catalogo.html', rotulo: 'Marcas' },
  { url: 'servicos.html', rotulo: 'Serviços' },
  { url: 'como-comprar.html', rotulo: 'Como comprar' },
  { url: 'lojas/', rotulo: 'Lojas' },
  { url: 'contato.html', rotulo: 'Contato' },
];

/* ─── Marcador de pendência: vira um aviso visível na própria página ─── */
function pendencia(codigo, texto) {
  return `        <aside class="cartao cartao-azul mt-10 p-7" data-pendencia="${codigo}">
          <p class="rotulo">Conteúdo pendente · ${codigo}</p>
          <p class="mt-3 text-sm leading-relaxed">${texto}</p>
        </aside>`;
}

/* ─── Escape de texto vindo de dados (data/*.json) ───────────────────
   As páginas institucionais têm o texto escrito no próprio gerador, onde
   o autor controla o que entra. As páginas de unidade montam frases a
   partir do JSON, e aí `&` ou aspas cruas quebrariam o atributo ou o
   HTML. `atributo()` é para dentro de href/content/alt; `texto()` para
   conteúdo de elemento. */
function texto(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function atributo(valor) {
  return texto(valor).replace(/"/g, '&quot;');
}

/* `atualEhExato` distingue duas situações que o mesmo destaque de menu cobre:
   - a página É o item do menu (index.html está em "Início")  → aria-current="page"
   - a página PERTENCE à seção do item, mas não é ela (uma unidade em "Lojas")
                                                             → aria-current="true"

   A diferença não é cosmética. `page` afirma "este link é a página atual", e
   num link que leva embora — /lojas/ visto de /lojas/farroupilha/ — o leitor
   de tela anuncia "página atual" sobre um link de saída. `true` diz apenas
   "item atual do conjunto", que é o que de fato acontece: a unidade está
   dentro de Lojas. O destaque visual é o mesmo nos dois casos. */
/* Os itens saem de funções próprias porque têm DOIS consumidores: o
   cabecalho() daqui, que monta as 18 páginas geradas, e o
   aplicar-menu.js, que troca só os <nav> das 5 escritas à mão. Se cada
   um montasse os seus, os dois grupos voltariam a divergir — que é
   exatamente o defeito que o MENU único existe para fechar. */
function itensMenuDesktop(atual, P = '', marcaAtual = 'page') {
  return MENU.map(
    (m) =>
      `          <a class="link-sub text-sm ${
        m.url === atual ? 'text-branco" href="' + P + m.url + '" aria-current="' + marcaAtual : 'text-prata hover:text-branco" href="' + P + m.url + ''
      }">${m.rotulo}</a>`
  ).join('\n');
}

function itensMenuMobile(atual, P = '') {
  return MENU.map(
    (m) =>
      `        <a class="border-b border-branco/10 py-5 text-4xl ${
        m.url === atual ? 'text-azul' : 'text-branco'
      }" href="${P}${m.url}">${m.rotulo}</a>`
  ).join('\n');
}

function cabecalho(atual, prefixo = '', atualEhExato = true) {
  const P = prefixo;
  const marcaAtual = atualEhExato ? 'page' : 'true';

  const itens = itensMenuDesktop(atual, P, marcaAtual);
  const mobile = itensMenuMobile(atual, P);

  return `    <header class="cabecalho fixed inset-x-0 top-0 z-50 border-b border-transparent" data-cabecalho>
      <div class="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-6 py-5 lg:px-10">
        <a href="${P}index.html" class="flex items-center gap-3" aria-label="Rede HG Smart — página inicial">
          <img src="${P}assets/img/icones/LOGO.png" alt="Logo da Rede HG Smart" width="132" height="36" class="h-8 w-auto" />
        </a>
        <nav aria-label="Navegação principal" class="hidden items-center gap-9 lg:flex">
${itens}
        </nav>
        <a href="${P}lojas/" class="btn btn-azul hidden lg:inline-flex">Ver as lojas</a>
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
      <a href="${P}lojas/" class="btn btn-azul mt-10 w-full">Ver as lojas</a>
    </div>`;
}

/* O rodapé vem de aplicar-rodape.js — fonte única para todas as páginas.
   Antes existia uma cópia aqui, e as duas divergiram na primeira vez
   que o rodapé mudou. */
const { rodape } = require('./aplicar-rodape');

/* Serializa um objeto para dentro de <script type="application/ld+json">.

   Duplica de propósito o jsonLdIndentado() de schema-loja.js: aquele
   módulo já faz `require('./layout')`, e importar de volta fecharia um
   ciclo. São seis linhas — mais barato que o ciclo.

   O `</script` escapado importa: JSON.stringify não faz isso, e uma
   string com essa sequência fecharia a tag mais cedo. */
function jsonLd(objeto, recuo = '      ') {
  return JSON.stringify(objeto, null, 2)
    .replace(/<\/(script)/gi, '<\\/$1')
    .split('\n')
    .map((linha) => recuo + linha)
    .join('\n');
}

/* ─── BreadcrumbList ─────────────────────────────────────────────
   Diz ao Google onde a página fica dentro do site. O ganho visível é o
   resultado de busca trocar a URL crua por "hgsmart.com.br › Lojas ›
   Caxias do Sul" — mais legível, e mais clicável em resultado local.

   A trilha é derivada da própria URL, não escrita à mão: `lojas/x/`
   vira Início › Lojas › <rótulo>, e uma página de raiz vira
   Início › <rótulo>. Assim nenhuma página nova nasce sem trilha nem com
   trilha errada, que é o risco de manter uma lista paralela.

   As URLs saem absolutas de propósito, como o canonical e o og:url — o
   `item` do schema não aceita caminho relativo. */
function trilha(url, rotulo) {
  const itens = [{ nome: 'Início', url: `${DOMINIO}/` }];

  // Uma página dentro de lojas/<id>/ passa por "Lojas" antes de si
  if (/^lojas\/.+/.test(url)) {
    itens.push({ nome: 'Lojas', url: `${DOMINIO}/lojas/` });
  }

  const propria = `${DOMINIO}/${url}`;
  if (propria !== `${DOMINIO}/` && itens[itens.length - 1].url !== propria) {
    itens.push({ nome: rotulo, url: propria });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nome,
      item: it.url,
    })),
  };
}

function pagina({ arquivo, titulo, descricao, url, rotulo, h1, intro, corpo, schema, atual, prefixo = '', atualEhExato = true, migalha }) {
  const P = prefixo;

  /* O rótulo do topo ("Unidade", "Matriz") não serve de nome na trilha —
     `migalha` permite passar o nome real da página quando os dois
     divergem, como nas unidades, onde a trilha quer a cidade. */
  const blocoTrilha = jsonLd(trilha(url, migalha || rotulo));

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
    <link rel="icon" href="${P}assets/img/icones/FAVICON.png" />
    <link rel="preload" href="${P}assets/fontes/BebasNeue-400.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="${P}assets/fontes/Inter-variavel.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="${P}assets/css/site.css" />
${schema ? `\n    <script type="application/ld+json">\n${schema}\n    </script>\n` : ''}
    <script type="application/ld+json">
${blocoTrilha}
    </script>
  </head>

  <body class="antialiased">
    <div class="progresso" data-progresso aria-hidden="true"></div>
    <a href="#conteudo" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70 focus:rounded-full focus:bg-azul focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white">Ir para o conteúdo</a>

${cabecalho(atual || arquivo, P, atualEhExato)}

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

${rodape(P)}

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

    <script src="${P}assets/vendor/lenis.min.js" defer></script>
    <script src="${P}assets/vendor/gsap.min.js" defer></script>
    <script src="${P}assets/vendor/ScrollTrigger.min.js" defer></script>
    <script src="${P}assets/js/site.js" defer></script>
    <script src="${P}assets/js/banner.js" defer></script>
    <script src="${P}assets/js/motion.js" defer></script>
  </body>
</html>
`;
}

module.exports = {
  DOMINIO,
  ZAP_MATRIZ,
  MENU,
  pendencia,
  cabecalho,
  itensMenuDesktop,
  itensMenuMobile,
  pagina,
  texto,
  atributo,
};
