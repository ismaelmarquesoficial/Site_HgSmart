/**
 * Escreve o rodapé em todas as páginas a partir de uma definição única.
 *
 * POR QUE UM SCRIPT
 * O rodapé vive hoje em dois lugares: embutido à mão nas 5 páginas
 * originais e dentro de ferramentas/gerar-paginas.js nas 7 geradas.
 * Editar os dois na mão é como uma delas fica desatualizada. Este script
 * substitui o bloco footer inteiro em todos os arquivos, então a fonte da
 * verdade passa a ser aqui.
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

const INSTITUCIONAL = [
  ['index.html', 'Início'],
  ['quem-somos.html', 'Quem Somos'],
  ['servicos.html', 'Serviços'],
  ['catalogo.html', 'Marcas'],
  ['lojas.html', 'Lojas'],
  // O blog continua no WordPress: o site novo não tem essa seção, então
  // o link sai do domínio em vez de apontar para uma página inexistente.
  ['https://hgsmart.com.br/blog', 'Blog', true],
];

/* ATENÇÃO: politica-de-cookies.html NÃO está aqui.

   O desenho aprovado do rodapé lista só duas páginas legais, e o rodapé
   é o único lugar do site que linka para elas. Ou seja: a Política de
   Cookies existe, está no sitemap.xml, e não tem link de lugar nenhum —
   é uma página órfã. Ou ela volta para esta lista, ou o arquivo e a
   entrada no sitemap devem ser removidos. Está pendente de decisão. */
const LEGAL = [
  ['politica-de-privacidade.html', 'Política de Privacidade'],
  ['termos-de-uso.html', 'Termos de Uso'],
];

const REDES = [
  ['https://www.instagram.com/redehgsmart/', 'Instagram'],
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

function rodape() {
  return `    <footer class="border-t border-branco/10 bg-preto-alto">
      <div class="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <!-- Cinco colunas numa linha só. A da marca é mais larga que as
             outras quatro: ela carrega texto corrido, e as demais são
             listas curtas. -->
        <div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr_1.4fr]">
          <div>
            <img
              src="assets/img/icones/LOGO.png"
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
${INSTITUCIONAL.map(([u, r, ext]) => link(u, r, ext)).join('\n')}
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
    `${i > 0 ? '            <li aria-hidden="true" class="text-cinza">•</li>\n' : ''}            <li><a class="link-sub text-prata hover:text-branco" href="${u}">${r}</a></li>`
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

const paginas = fs
  .readdirSync(RAIZ)
  .filter((f) => f.endsWith('.html'))
  .sort();

const novo = rodape();
let trocadas = 0;

for (const arquivo of paginas) {
  const caminho = path.join(RAIZ, arquivo);
  const html = fs.readFileSync(caminho, 'utf8');

  // Casa do <footer ...> até </footer>, inclusive
  const re = /^[ \t]*<footer[\s\S]*?<\/footer>/m;
  if (!re.test(html)) {
    console.log(`  ${arquivo.padEnd(30)} sem rodapé — pulado`);
    continue;
  }

  fs.writeFileSync(caminho, html.replace(re, novo), 'utf8');
  trocadas++;
  console.log(`  ${arquivo.padEnd(30)} rodapé atualizado`);
}

console.log(`\n  ${trocadas} de ${paginas.length} páginas\n`);
