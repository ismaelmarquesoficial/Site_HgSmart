/**
 * Escreve o rodapé em todas as páginas a partir de uma definição única.
 *
 * POR QUE UM SCRIPT
 * O rodapé vive hoje em dois lugares: embutido à mão nas 5 páginas
 * originais e dentro de ferramentas/layout.js nas 8 geradas.
 * Editar os dois na mão é como uma delas fica desatualizada. Este script
 * substitui o bloco footer inteiro em todos os arquivos, então a fonte da
 * verdade passa a ser aqui.
 *
 * ─── PREFIXO ───
 * Desde que as páginas de unidade existem, o rodapé é escrito em três
 * profundidades diferentes, e um `href="index.html"` só funciona na raiz:
 *
 *     raiz                    prefixo = ''
 *     lojas/index.html        prefixo = '../'
 *     lojas/<id>/index.html   prefixo = '../../'
 *
 * Só o que é relativo recebe prefixo. Links externos (redes, blog),
 * `tel:` e `mailto:` ficam como estão.
 *
 * Uso: npm run rodape
 */

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');

/* ─── Dados ──────────────────────────────────────────────────── */

const EMPRESA = {
  razaoSocial: 'HG Smart LTDA',
  cnpj: '54.988.129/0001-89',
  logradouro: 'Rua Marechal Floriano, 829',
  bairro: 'Centro',
  cidade: 'Santa Cruz do Sul/RS',
  cep: 'CEP 96.810-052',
  email: 'contato@hgsmart.com.br',
};

const TELEFONES = [
  ['+5551998575806', '(51) 9 9857-5806'],
  ['+5551920035624', '(51) 9 2003-5624'],
  ['+5551990178584', '(51) 9 9017-8584'],
];

/* RESOLVIDO em 2026-08-11: ceo, garantia, faq e contato entraram nesta
   lista — mesmo caso da política de cookies logo abaixo, quatro anos-luz
   depois de ninguém notar. As quatro existiam, estavam no sitemap.xml e
   não recebiam UM link em todo o site: o Google indexava, o visitante
   nunca chegava. Elas nasceram para o menu de 9 itens do briefing, que
   não foi construído, e ficaram sem porta de entrada nenhuma.

   O header ficou com 7 itens (layout.js) e esta coluna com o mapa
   completo. É a divisão que o rodapé já fazia pelas páginas legais:
   quem procura acha, e o topo não vira lista de 11 links. */
const INSTITUCIONAL = [
  ['index.html', 'Início'],
  ['quem-somos.html', 'Quem Somos'],
  ['ceo.html', 'Conheça o CEO'],
  ['servicos.html', 'Serviços'],
  ['catalogo.html', 'Marcas'],
  ['como-comprar.html', 'Como comprar'],
  ['garantia.html', 'Garantia'],
  ['faq.html', 'FAQ'],
  ['contato.html', 'Contato'],
  ['lojas/', 'Lojas'],
  // O blog continua no WordPress: o site novo não tem essa seção, então
  // o link sai do domínio em vez de apontar para uma página inexistente.
  ['https://hgsmart.com.br/blog', 'Blog', true],
];

/* ─── Coluna "Nossas unidades" ─────────────────────────────────────
   As 10 páginas de unidade precisam de link em HTML estático, não só
   nos cartões que o site.js monta depois do fetch.

   O motivo é o princípio que o README fixa: nada no site depende de
   JavaScript para ser lido. Se o único caminho até /lojas/lajeado/
   fosse um cartão renderizado por JS, o princípio quebraria justamente
   nas páginas cujo objetivo é ser encontrada — e o rastreador só
   chegaria nelas pelo sitemap, sem nenhum link interno apontando.

   O rodapé é o lugar certo porque propaga para as 13 páginas de uma vez
   e já é fonte única. A lista sai de data/lojas.json, então abrir uma
   unidade nova não exige editar HTML — igual ao resto do site.
   Pelotas fica fora: `em_breve`, não tem página. */
const dadosLojas = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'lojas.json'), 'utf8'));
const UNIDADES = dadosLojas.lojas
  .filter((l) => !l.em_breve)
  .map((l) => [`lojas/${l.id}/`, l.cidade]);

/* RESOLVIDO em 2026-08-04: politica-de-cookies.html entrou nesta lista.

   Antes ela era página órfã — existia, estava no sitemap.xml e não tinha
   link de lugar nenhum. O Google indexava, o visitante nunca chegava.
   O rodapé é o único lugar do site que linka as páginas legais, então é
   aqui que ela precisa estar. */
const LEGAL = [
  ['politica-de-privacidade.html', 'Política de Privacidade'],
  ['termos-de-uso.html', 'Termos de Uso'],
  ['politica-de-cookies.html', 'Política de Cookies'],
];

/* CORRIGIDO em 2026-08-11 — o Instagram daqui era `@redehgsmart`, que
   não aparece em NENHUM documento do planejamento. O registro de canais
   diz que o site sempre linkou `@hgsmart.scs`, o perfil da matriz.

   A rede usa `@hgsmart` como conta geral e `@hgsmart.scs` na sede; cada
   unidade tem a sua. Esta coluna é o rodapé de todas as páginas, então
   leva a conta GERAL — o perfil de cada loja sai na página da loja, de
   `data/lojas.json`. */
const REDES = [
  ['https://www.instagram.com/hgsmart/', 'Instagram'],
  ['https://www.facebook.com/redehgsmart/', 'Facebook'],
  ['https://www.tiktok.com/@redehgsmart', 'TikTok'],
  ['https://www.youtube.com/@redehgsmart', 'YouTube'],
  // O WhatsApp da coluna Redes aponta para a MATRIZ, igual ao botão
  // fixo. Quem quer a loja da própria cidade tem a página /lojas, onde
  // cada unidade lista os seus números.
  ['https://wa.me/5551998575806', 'WhatsApp'],
];

/* ─── Montagem ───────────────────────────────────────────────── */

const link = (url, rotulo, externo) =>
  `              <li><a class="link-sub text-prata hover:text-branco" href="${url}"${
    externo ? ' target="_blank" rel="noopener noreferrer"' : ''
  }>${rotulo}</a></li>`;

function rodape(prefixo = '') {
  const P = prefixo;

  return `    <footer class="border-t border-branco/10 bg-preto-alto">
      <div class="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <!-- Seis colunas. A da marca é mais larga que as outras: ela
             carrega texto corrido, e as demais são listas curtas.

             Seis colunas a partir de xl e não de lg porque a 1024px cada
             uma cairia para ~150px, e "Cachoeira do Sul" na coluna de
             unidades quebraria em três linhas. Entre lg e xl a grade vai
             a 3 × 2, que é onde os nomes de cidade ainda cabem. -->
        <div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.4fr_0.9fr_1.1fr_0.9fr_1.1fr_1.3fr]">
          <div>
            <img
              src="${P}assets/img/icones/LOGO.png"
              alt="Logo da Rede HG Smart"
              width="132"
              height="36"
              loading="lazy"
              class="h-9 w-auto"
            />
            <p class="mt-7 max-w-xs text-sm leading-relaxed text-prata">
              Rede de lojas de celulares no Rio Grande do Sul. Tecnologia
              acessível, garantia oficial e condições reais.
            </p>
          </div>

          <nav aria-labelledby="rodape-institucional">
            <h2 id="rodape-institucional" class="rotulo mb-6">Institucional</h2>
            <ul class="space-y-3 text-sm">
${INSTITUCIONAL.map(([u, r, ext]) => link(ext ? u : P + u, r, ext)).join('\n')}
            </ul>
          </nav>

          <nav aria-labelledby="rodape-unidades">
            <h2 id="rodape-unidades" class="rotulo mb-6">Nossas unidades</h2>
            <ul class="space-y-3 text-sm">
${UNIDADES.map(([u, r]) => link(P + u, r)).join('\n')}
            </ul>
          </nav>

          <nav aria-labelledby="rodape-redes">
            <h2 id="rodape-redes" class="rotulo mb-6">Redes</h2>
            <ul class="space-y-3 text-sm">
${REDES.map(([u, r]) => link(u, r, true)).join('\n')}
            </ul>
          </nav>

          <div>
            <h2 class="rotulo mb-6">Contato</h2>
            <ul class="space-y-3 text-sm">
${TELEFONES.map(([tel, exib]) => `              <li><a class="link-sub text-prata hover:text-branco tabular-nums" href="tel:${tel}">${exib}</a></li>`).join('\n')}
              <li class="pt-3">
                <a class="link-sub break-all text-prata hover:text-branco" href="mailto:${EMPRESA.email}">${EMPRESA.email}</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="rotulo mb-6">Matriz</h2>
            <dl class="space-y-5 text-sm">
              <div>
                <dt class="text-cinza">Razão Social</dt>
                <dd class="mt-1 text-prata">${EMPRESA.razaoSocial}</dd>
              </div>
              <div>
                <dt class="text-cinza">CNPJ</dt>
                <dd class="mt-1 text-prata tabular-nums">${EMPRESA.cnpj}</dd>
              </div>
              <div>
                <dt class="sr-only">Endereço</dt>
                <dd>
                  <address class="not-italic leading-relaxed text-prata">
                    ${EMPRESA.logradouro}<br />
                    ${EMPRESA.bairro}<br />
                    ${EMPRESA.cidade}<br />
                    ${EMPRESA.cep}
                  </address>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Espaço menor que o padding externo do rodapé (py-16 = 64px).
             Em my-12 os divisores davam 48px de cada lado, quase o mesmo
             respiro da borda da seção, e as três faixas pareciam blocos
             soltos em vez de partes do mesmo rodapé. -->
        <div class="hairline my-8"></div>

        <!-- Faixa legal, centralizada -->
        <nav aria-label="Páginas legais">
          <ul class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
${LEGAL.map(
  ([u, r], i) =>
    `${i > 0 ? '            <li aria-hidden="true" class="text-cinza">•</li>\n' : ''}            <li><a class="link-sub text-prata hover:text-branco" href="${P}${u}">${r}</a></li>`
).join('\n')}
          </ul>
        </nav>

        <!-- Espaço menor que o padding externo do rodapé (py-16 = 64px).
             Em my-12 os divisores davam 48px de cada lado, quase o mesmo
             respiro da borda da seção, e as três faixas pareciam blocos
             soltos em vez de partes do mesmo rodapé. -->
        <div class="hairline my-8"></div>

        <!-- Assinatura -->
        <p class="text-center text-xs leading-relaxed text-cinza">
          © <span data-ano>2026</span> ${EMPRESA.razaoSocial}
          <span aria-hidden="true" class="px-2">•</span>
          Todos os direitos reservados
          <span aria-hidden="true" class="px-2">•</span>
          <span class="tabular-nums">CNPJ ${EMPRESA.cnpj}</span>
        </p>
      </div>
    </footer>`;
}

/* O gerador de páginas usa esta mesma função. Sem isso, um `npm run
   paginas` reescreveria as 7 páginas geradas com um rodapé antigo e o
   site ficaria com dois rodapés diferentes conviv endo. */
module.exports = { rodape };

// Chamado com `require`: só exporta e sai, sem mexer em arquivo.
if (require.main !== module) return;

/* ─── Aplicação ──────────────────────────────────────────────── */

/* A varredura precisa descer em lojas/. Antes ela era só
   `readdirSync(RAIZ)`, e com isso as páginas de unidade nasceriam com o
   rodapé do dia em que foram geradas e nunca mais seriam atualizadas —
   recriando exatamente a divergência que este script existe para matar.

   Cada página vem com o prefixo da sua profundidade. */
/* 404.html fica FORA da varredura.
   Ela é servida para qualquer URL inexistente, inclusive dentro de
   lojas/<algo>/, então todo caminho dela é absoluto. Este script escreve
   caminhos RELATIVOS a partir de um prefixo — e prefixo é justamente o
   que não existe quando a URL é desconhecida. Passar o rodapé nela
   deixaria os links do rodapé quebrados exatamente nas URLs profundas. */
const FORA_DA_VARREDURA = new Set(['404.html']);

function paginasDoSite() {
  const lista = fs
    .readdirSync(RAIZ)
    .filter((f) => f.endsWith('.html') && !FORA_DA_VARREDURA.has(f))
    .sort()
    .map((f) => ({ arquivo: f, prefixo: '' }));

  const pastaLojas = path.join(RAIZ, 'lojas');
  if (!fs.existsSync(pastaLojas)) return lista;

  // O índice das unidades: lojas/index.html, um nível abaixo
  if (fs.existsSync(path.join(pastaLojas, 'index.html'))) {
    lista.push({ arquivo: path.join('lojas', 'index.html'), prefixo: '../' });
  }

  // As unidades: lojas/<id>/index.html, dois níveis abaixo
  for (const entrada of fs.readdirSync(pastaLojas, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entrada.isDirectory()) continue;
    const alvo = path.join('lojas', entrada.name, 'index.html');
    if (fs.existsSync(path.join(RAIZ, alvo))) {
      lista.push({ arquivo: alvo, prefixo: '../../' });
    }
  }

  return lista;
}

const paginas = paginasDoSite();
let trocadas = 0;

for (const { arquivo, prefixo } of paginas) {
  const caminho = path.join(RAIZ, arquivo);
  const html = fs.readFileSync(caminho, 'utf8');

  // Casa do <footer ...> até </footer>, inclusive
  const re = /^[ \t]*<footer[\s\S]*?<\/footer>/m;
  if (!re.test(html)) {
    console.log(`  ${arquivo.padEnd(34)} sem rodapé — pulado`);
    continue;
  }

  fs.writeFileSync(caminho, html.replace(re, rodape(prefixo)), 'utf8');
  trocadas++;
  console.log(`  ${arquivo.padEnd(34)} rodapé atualizado${prefixo ? `  (prefixo ${prefixo})` : ''}`);
}

console.log(`\n  ${trocadas} de ${paginas.length} páginas\n`);
