/**
 * Gera os artefatos de SEO a partir de uma fonte única.
 *
 *   - robots.txt   — já liberando os bots de citação de IA
 *   - sitemap.xml  — todas as páginas do site, unidades incluídas
 *   - o bloco JSON-LD das 10 lojas, injetado em lojas/index.html
 *
 * ORDEM IMPORTA: rode `npm run lojas` antes de `npm run seo`. O sitemap
 * varre o disco atrás de lojas/<id>/index.html, então unidade que ainda
 * não foi gerada simplesmente não entra.
 *
 * Por que gerar em vez de escrever à mão: os dados das lojas vivem em
 * data/lojas.json. Se o schema fosse escrito à mão, abrir uma loja nova
 * exigiria editar o JSON e o HTML, e um dos dois ficaria defasado.
 *
 * Uso: npm run seo
 */

const fs = require('node:fs');
const path = require('node:path');

const { DOMINIO } = require('./layout');
/* A montagem do MobilePhoneStore saiu daqui para schema-loja.js quando
   surgiu o segundo emissor: cada página de unidade também publica o
   schema da sua loja. Um dado estruturado, uma fonte. */
const { schemaLoja, jsonLdIndentado } = require('./schema-loja');

const RAIZ = path.join(__dirname, '..');

/* Páginas do site. `mudanca` e `prioridade` são dicas para o crawler,
   não garantias — o Google usa como sinal fraco. */
const PAGINAS = [
  { arquivo: 'index.html', url: '/', prioridade: '1.0', mudanca: 'weekly' },
  { arquivo: 'quem-somos.html', url: '/quem-somos', prioridade: '0.8', mudanca: 'monthly' },
  { arquivo: 'catalogo.html', url: '/catalogo', prioridade: '0.9', mudanca: 'weekly' },
  { arquivo: 'servicos.html', url: '/servicos', prioridade: '0.8', mudanca: 'monthly' },
  /* O índice das unidades passou de `lojas.html` para `lojas/index.html`.
     Motivo: o sitemap já publicava `/lojas` sem extensão, e criar o
     diretório `lojas/` para as unidades faria a maioria dos hosts
     estáticos resolver `/lojas` para o diretório — que não teria índice.
     Arquivo e URL passam a concordar, sem depender de regra de rewrite. */
  { arquivo: 'lojas/index.html', url: '/lojas/', prioridade: '0.9', mudanca: 'monthly' },
  { arquivo: 'como-comprar.html', url: '/como-comprar', prioridade: '0.9', mudanca: 'monthly' },
  { arquivo: 'faq.html', url: '/faq', prioridade: '0.8', mudanca: 'monthly' },
  { arquivo: 'garantia.html', url: '/garantia', prioridade: '0.6', mudanca: 'monthly' },
  { arquivo: 'ceo.html', url: '/ceo', prioridade: '0.6', mudanca: 'yearly' },
  { arquivo: 'contato.html', url: '/contato', prioridade: '0.7', mudanca: 'monthly' },
  { arquivo: 'politica-de-privacidade.html', url: '/politica-de-privacidade', prioridade: '0.3', mudanca: 'yearly' },
  { arquivo: 'termos-de-uso.html', url: '/termos-de-uso', prioridade: '0.3', mudanca: 'yearly' },
  { arquivo: 'politica-de-cookies.html', url: '/politica-de-cookies', prioridade: '0.3', mudanca: 'yearly' },
];

const todasAsLojas = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'lojas.json'), 'utf8')).lojas;

/* Unidade anunciada e não aberta fica FORA do schema: marcar como loja
   existente uma que não atende é informação errada para o Google e para
   quem pesquisa. Ela aparece na página como "em breve", só não no JSON-LD. */
const lojas = todasAsLojas.filter((l) => !l.em_breve);

/* ─────────────────────────────────────────────────────────────
   robots.txt
   ───────────────────────────────────────────────────────────── */
function gerarRobots() {
  // Distinção que importa: bots de CITAÇÃO (o site aparece na resposta,
  // com link) são liberados. Bots puramente de TREINO ficam de fora --
  // eles consomem o conteúdo sem devolver visita.
  const conteudo = `# Rede HG Smart
# Gerado por ferramentas/gerar-seo.js -- nao edite a mao

User-agent: *
Allow: /
Disallow: /assets/img/banners/original/

# Buscadores de IA que CITAM a fonte: liberados de proposito.
# Bloquear estes tira a rede das respostas do ChatGPT, Perplexity,
# Claude e das AI Overviews do Google.
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: DuckAssistBot
Allow: /

Sitemap: ${DOMINIO}/sitemap.xml
`;
  fs.writeFileSync(path.join(RAIZ, 'robots.txt'), conteudo, 'utf8');
  return 'robots.txt';
}

/* ─────────────────────────────────────────────────────────────
   sitemap.xml — só entram páginas que existem no disco
   ───────────────────────────────────────────────────────────── */
/* As páginas de unidade não estão na lista PAGINAS: elas são geradas a
   partir de data/lojas.json e mudam quando a rede abre ou fecha uma
   loja. Manter uma segunda lista aqui daria a chance de ela ficar
   defasada — então o sitemap lê o disco.

   Vale a mesma regra da lista fixa: entra só o que existe. Se alguém
   rodar `npm run seo` antes de `npm run lojas`, o sitemap sai sem as
   unidades em vez de publicar 10 URLs que dão 404. */
function unidadesNoDisco() {
  const pasta = path.join(RAIZ, 'lojas');
  if (!fs.existsSync(pasta)) return [];

  return fs
    .readdirSync(pasta, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(pasta, e.name, 'index.html')))
    .map((e) => e.name)
    .sort()
    .map((id) => ({
      arquivo: path.join('lojas', id, 'index.html'),
      url: `/lojas/${id}/`,
      prioridade: '0.8',
      mudanca: 'monthly',
    }));
}

function gerarSitemap(dataIso) {
  const todas = [...PAGINAS, ...unidadesNoDisco()];
  const existentes = todas.filter((p) => fs.existsSync(path.join(RAIZ, p.arquivo)));
  const ausentes = todas.filter((p) => !fs.existsSync(path.join(RAIZ, p.arquivo)));

  const entradas = existentes
    .map(
      (p) => `  <url>
    <loc>${DOMINIO}${p.url}</loc>
    <lastmod>${dataIso}</lastmod>
    <changefreq>${p.mudanca}</changefreq>
    <priority>${p.prioridade}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Gerado por ferramentas/gerar-seo.js -- nao edite a mao -->
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
${entradas}
</urlset>
`.replace('www.sitemap.org', 'www.sitemaps.org');

  fs.writeFileSync(path.join(RAIZ, 'sitemap.xml'), xml, 'utf8');
  return { arquivo: 'sitemap.xml', incluidas: existentes.length, ausentes: ausentes.map((p) => p.arquivo) };
}

/* ─────────────────────────────────────────────────────────────
   JSON-LD das lojas — MobilePhoneStore por unidade
   ───────────────────────────────────────────────────────────── */
function gerarSchemaLojas() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${DOMINIO}/lojas/#pagina`,
        name: 'Lojas da Rede HG Smart',
        url: `${DOMINIO}/lojas/`,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${DOMINIO}/#site` },
      },
      ...lojas.map(schemaLoja),
    ],
  };
}

/* Injeta entre marcadores. Sem marcador, insere antes de </head>. */
function injetar(arquivo, marcador, bloco) {
  const caminho = path.join(RAIZ, arquivo);
  if (!fs.existsSync(caminho)) return `${arquivo} (não existe, pulado)`;

  let html = fs.readFileSync(caminho, 'utf8');
  const ini = `<!-- ${marcador}:inicio -->`;
  const fim = `<!-- ${marcador}:fim -->`;
  const trecho = `${ini}\n${bloco}\n    ${fim}`;

  const re = new RegExp(`${ini}[\\s\\S]*?${fim}`);
  if (re.test(html)) {
    html = html.replace(re, trecho);
  } else {
    html = html.replace('</head>', `    ${trecho}\n  </head>`);
  }

  fs.writeFileSync(caminho, html, 'utf8');
  return arquivo;
}

/* ─────────────────────────────────────────────────────────────
   Execução
   ───────────────────────────────────────────────────────────── */
// A data vem de fora (argumento) para o resultado ser reproduzível
const data = process.argv[2] || new Date().toISOString().slice(0, 10);

console.log('\n  Gerando artefatos de SEO\n');

console.log('  ' + gerarRobots());

const sm = gerarSitemap(data);
console.log(`  ${sm.arquivo} — ${sm.incluidas} URLs`);
if (sm.ausentes.length) {
  console.log(`    fora (página ainda não existe): ${sm.ausentes.join(', ')}`);
}

const schema = gerarSchemaLojas();
const bloco = '<script type="application/ld+json">\n' + jsonLdIndentado(schema) + '\n    </script>';

console.log('  ' + injetar(path.join('lojas', 'index.html'), 'schema-lojas', bloco) + ` — ${lojas.length} lojas no JSON-LD`);
console.log('');
