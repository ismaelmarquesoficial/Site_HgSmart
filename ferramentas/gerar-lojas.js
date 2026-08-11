/**
 * Gera uma página por unidade: lojas/<id>/index.html → /lojas/<id>/
 *
 * POR QUE ESTAS PÁGINAS EXISTEM
 * O sitemap tinha 13 URLs, todas institucionais. Nenhuma respondia
 * "celular no boleto em Lajeado": a informação da unidade só existia
 * como cartão dentro do índice, sem URL própria, sem <title> e sem
 * <h1>. Para o Google isso é uma página sobre lojas, não dez lojas.
 *
 * ─── AS DUAS REGRAS QUE MANDAM NESTE ARQUIVO ───
 *
 * 1. NENHUM campo de auditoria do JSON vai para a página. Os blocos
 *    `divergencias_com_o_site_antigo` e `pendencias` são registro interno.
 *    Publicá-los já pôs o endereço ANTIGO de uma loja no corpo indexável,
 *    ao lado do novo. Ver o comentário longo em pendenciasDaLoja().
 *
 * 2. Toda frase publicada aqui tem que ser verificável em data/lojas.json.
 * Nada de ponto de referência, vizinhança, tempo de deslocamento, foto
 * ou avaliação por loja — nada disso está nos dados, e inventar seria
 * conteúdo local enganoso, que o Google trata no nível do DOMÍNIO, não
 * da página. Uma página inventada derruba as outras.
 *
 * Onde falta dado, a saída é `pendencia()`, que é um cartão VISÍVEL na
 * tela. É deliberado: placeholder invisível vira conteúdo publicado por
 * esquecimento.
 *
 * Também não se escreve número de parcelamento aqui. A arte do banner
 * diz 18x e a página de Serviços diz 25x — contradição aberta, item B1.
 * Enquanto não houver resposta, formas de pagamento nesta página são
 * apenas um link para como-comprar.html, sem número nenhum.
 *
 * Uso: npm run lojas   (depois `npm run build` e `npm run seo`)
 */

const fs = require('node:fs');
const path = require('node:path');

const { DOMINIO, pendencia, pagina, texto, atributo } = require('./layout');
const { schemaLoja, nomeLoja, jsonLdIndentado } = require('./schema-loja');

const RAIZ = path.join(__dirname, '..');
const PREFIXO = '../../'; // lojas/<id>/index.html está dois níveis abaixo da raiz

const dados = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'lojas.json'), 'utf8'));

/* Pelotas fica de fora: `em_breve`. Página de loja que não atende gera
   avaliação ruim e não tem Perfil no Google para apontar para ela. */
const lojas = dados.lojas.filter((l) => !l.em_breve);

/* ─── Rótulos de dia ───
   As chaves do JSON são as faixas como a HG Smart divulga. `fechado` é
   o único valor literal aceito para "não abre" — nunca "0" nem "1", que
   foi o bug do conversor do plugin antigo (ver README). */
const DIAS = [
  ['semana', 'Seg a sex'],
  ['sabado', 'Sábado'],
  ['domingo', 'Domingo'],
];

/* ─────────────────────────────────────────────────────────────
   Helpers de endereço

   Espelham enderecoCompleto() e linkRota() de assets/js/site.js. A
   duplicação é consciente e não tem como sumir: site.js roda no
   navegador, sem bundler, e não pode dar `require` num módulo Node.
   Se um dos dois mudar, mude o outro.
   ───────────────────────────────────────────────────────────── */
function enderecoCompleto(loja) {
  return [loja.endereco, loja.bairro, loja.cidade, loja.uf, 'Brasil'].filter(Boolean).join(', ');
}

function linkRota(loja) {
  const base = 'https://www.google.com/maps/dir/?api=1&destination=';
  return loja.coord
    ? `${base}${loja.coord.lat},${loja.coord.lng}`
    : `${base}${encodeURIComponent(enderecoCompleto(loja))}`;
}

/* ─────────────────────────────────────────────────────────────
   Pendências por unidade

   ⚠️ REGRA DURA: nenhum campo de auditoria do JSON entra aqui.

   Os blocos `divergencias_com_o_site_antigo` e `pendencias` de
   data/lojas.json são registro INTERNO — outro público, outro registro,
   ASCII sem acento de propósito. Uma versão anterior deste arquivo os
   imprimia direto na página, e o resultado foi Cachoeira do Sul
   publicando o endereço ANTIGO ao lado do novo, em caixa alta, com
   "CONFIRMAR se sao duas lojas" no corpo indexável. Dois endereços para
   o mesmo ponto é precisamente o NAP inconsistente que estas páginas
   existem para evitar — a página estava produzindo o dano que a tarefa
   deveria prevenir.

   O aviso público é escrito AQUI, em registro de produção. Ele diz o
   que o visitante precisa fazer e para. Não repete o dado errado, não
   cita endereço antigo, não expõe a dúvida interna. Quem precisa do
   detalhe da auditoria lê o JSON.

   O que liga cada aviso são sinalizadores próprios por loja
   (`endereco_em_confirmacao`, `endereco_sem_numero`), criados para este
   fim — nunca o texto de auditoria.

   B16 = dado cadastral da unidade faltando ou a confirmar.
   B8  = foto real da fachada. São coisas diferentes e por isso têm
         códigos diferentes: B8 já significa "foto" no
         PLANO-DE-APLICACAO.md e não podia ser reaproveitado.
   ───────────────────────────────────────────────────────────── */

/* Junta em frase: "a, b e c" */
function juntar(itens) {
  if (itens.length <= 1) return itens.join('');
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
}

function temHorario(loja) {
  const h = loja.horarios || {};
  return DIAS.some(([chave]) => h[chave] && h[chave] !== 'fechado');
}

function pendenciasDaLoja(loja) {
  const faltando = [];

  /* Frases soltas, ditas DEPOIS da lista.

     A aposta sobre a esquina já esteve grudada no item da lista, com um
     travessão. Só saía certa porque `juntar()` liga o último com " e " e
     esse item calhava de ser o último em Farroupilha. Bastaria a loja
     ficar sem horário ou sem WhatsApp — que entram na lista depois — para
     virar "…o número no endereço — a referência publicada é a esquina e o
     WhatsApp próprio da unidade", com a aposta regendo os dois.

     Item de lista é substantivo e nada mais. Explicação vira frase. */
  const observacoes = [];

  if (!loja.coord) {
    faltando.push('a <strong>localização exata no mapa</strong>');
  }
  if (!loja.cep) {
    faltando.push('o <strong>CEP</strong>');
  }
  if (loja.endereco_em_confirmacao) {
    faltando.push('a <strong>confirmação do endereço completo</strong> com a rede');
  }
  if (loja.endereco_sem_numero) {
    faltando.push('o <strong>número no endereço</strong>');
    observacoes.push('A referência publicada é a esquina.');
  }

  /* Horário e WhatsApp ausentes não podem sumir em silêncio. Os blocos
     correspondentes simplesmente não são desenhados quando falta o dado,
     e sem este aviso a página sairia sem o bloco E sem nada indicando
     que falta algo — pior que o placeholder invisível contra o qual o
     README adverte, porque nem placeholder fica.

     Não acontece com os dados de hoje. Vai acontecer: estas páginas são
     geradas de um JSON que o cliente ainda vai mexer. */
  if (!temHorario(loja)) {
    faltando.push('o <strong>horário de atendimento</strong>');
  }
  const temZap = Boolean(loja.whatsapp?.length);
  if (!temZap) {
    faltando.push('o <strong>WhatsApp próprio da unidade</strong>');
  }

  /* Cada unidade tem Instagram próprio, como tem WhatsApp e Perfil da
     Empresa próprios. Só o da matriz foi confirmado até agora.
     Entra na lista de faltantes em vez de cair no perfil da rede: o
     visitante que abre o Instagram esperando ver a loja da cidade dele
     e encontra a conta geral não volta para reclamar — só não segue. */
  if (!loja.instagram) {
    faltando.push('o <strong>Instagram próprio da unidade</strong>');
  }

  const cartoes = [];

  if (faltando.length) {
    cartoes.push(
      pendencia(
        `B16-${loja.id}`,
        `Esta página ainda não traz tudo sobre a unidade de ${texto(loja.cidade)}. ` +
          // sujeito composto pede plural: "Faltam o CEP e a confirmação…"
          `${faltando.length > 1 ? 'Faltam' : 'Falta'} ${juntar(faltando)}. ` +
          (observacoes.length ? observacoes.join(' ') + ' ' : '') +
          'Nada aqui é preenchido por aproximação: enquanto o dado não for confirmado, o campo fica fora da página e fora da marcação, em vez de entrar com um valor provável.' +
          (temZap
            ? ' Se precisar do detalhe antes de se deslocar, fale com a unidade pelo WhatsApp acima.'
            : '')
      )
    );
  }

  // Vale para as 10: o briefing pede foto por unidade e não existe nenhuma.
  cartoes.push(
    pendencia(
      'B8-fotos',
      `Falta a <strong>foto real da fachada</strong> desta unidade. A imagem de compartilhamento desta página é a foto genérica da rede, ` +
        'não a loja de ' +
        texto(loja.cidade) +
        '. O briefing pede foto por unidade, e usar a de outra loja seria representar errado o ponto de venda.'
    )
  );

  return cartoes.join('\n');
}

/* ─────────────────────────────────────────────────────────────
   Blocos da página
   ───────────────────────────────────────────────────────────── */
function blocoEndereco(loja) {
  const linhas = [texto(loja.endereco)];
  if (loja.complemento) linhas.push(`<span class="text-cinza">${texto(loja.complemento)}</span>`);
  if (loja.bairro) linhas.push(texto(loja.bairro));
  linhas.push(`${texto(loja.cidade)} · ${texto(loja.uf)}`);
  if (loja.cep) linhas.push(`<span class="text-cinza">CEP ${texto(loja.cep)}</span>`);

  return `            <article class="cartao p-8">
              <h3 class="text-xl text-branco">Endereço</h3>
              <address class="mt-4 not-italic text-sm leading-relaxed text-prata">
                ${linhas.join('<br />\n                ')}
              </address>
              <div class="mt-6 border-t border-branco/10 pt-5">
                <a class="link-sub text-sm text-prata hover:text-branco" href="${atributo(linkRota(loja))}" target="_blank" rel="noopener noreferrer">
                  Como chegar${loja.coord ? '' : ' (por endereço)'}
                </a>
              </div>
            </article>`;
}

function blocoHorarios(loja) {
  const h = loja.horarios || {};
  const abertos = DIAS.filter(([chave]) => h[chave] && h[chave] !== 'fechado');

  if (!abertos.length) return '';

  const itens = abertos
    .map(
      ([chave, rotulo]) => `                <div class="flex justify-between gap-3">
                  <dt class="text-cinza">${rotulo}</dt>
                  <dd class="text-branco tabular-nums">${texto(h[chave])}</dd>
                </div>`
    )
    .join('\n');

  /* O selo só aparece se o dado disser que abre no domingo. Nas oito
     unidades sem o campo, o bloco simplesmente não sai. */
  const seloDomingo =
    h.domingo && h.domingo !== 'fechado'
      ? `\n              <p class="mt-5 inline-flex rounded-full border border-azul/40 bg-azul/10 px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-azul">Abre no domingo</p>`
      : '';

  return `            <article class="cartao p-8">
              <h3 class="text-xl text-branco">Horário de atendimento</h3>
              <dl class="mt-4 space-y-1 text-sm">
${itens}
              </dl>${seloDomingo}
            </article>`;
}

function blocoWhatsapp(loja) {
  const zaps = loja.whatsapp || [];
  if (!zaps.length) return '';

  /* Chips de 44px de alvo — o mesmo .chip-zap dos cartões do índice.
     WCAG 2.5.8: alvo de toque mínimo. */
  const chips = zaps
    .map(
      (z) => `                  <li>
                    <a class="chip-zap" href="https://wa.me/${atributo(z.numero)}" target="_blank" rel="noopener noreferrer" aria-label="Conversar no WhatsApp: ${atributo(z.exibicao)}">
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      ${texto(z.exibicao)}
                    </a>
                  </li>`
    )
    .join('\n');

  return `            <article class="cartao p-8">
              <h3 class="text-xl text-branco">WhatsApp da unidade</h3>
              <p class="mt-3 text-sm leading-relaxed text-prata">
                ${zaps.length > 1 ? `${zaps.length} números atendem esta loja.` : 'Número que atende esta loja.'}
              </p>
              <ul class="mt-5 flex flex-wrap gap-2">
${chips}
              </ul>
            </article>`;
}

/* Instagram DA UNIDADE, não o da rede.
   Cada loja tem o seu perfil, junto com o seu WhatsApp e o seu Google
   Meu Negócio. Apontar o perfil da rede na página de Caxias mandaria o
   visitante para o lugar errado — e é o Perfil da Empresa de cada
   unidade que precisa apontar de volta para a própria página, senão o
   par site↔Maps não fecha em cidade nenhuma.

   Só a matriz tem o perfil confirmado até agora. Onde falta, entra o
   cartão de pendência visível em vez de cair no perfil da rede por
   padrão: link errado é pior que link ausente, porque ninguém percebe. */
function blocoInstagram(loja) {
  if (!loja.instagram) return '';

  return `            <article class="cartao p-8">
              <h3 class="text-xl text-branco">Instagram da unidade</h3>
              <p class="mt-3 text-sm leading-relaxed text-prata">
                Fotos, novidades e campanhas desta loja.
              </p>
              <p class="mt-5">
                <a class="link-sub text-azul" href="https://www.instagram.com/${atributo(loja.instagram)}/" target="_blank" rel="noopener noreferrer">@${texto(loja.instagram)}</a>
              </p>
            </article>`;
}

/* Formas de pagamento: SÓ o link. Nenhum número de parcela sai daqui
   enquanto o B1 (18x × 25x) estiver aberto — publicar um dos dois na
   página de dez unidades é multiplicar a contradição por dez.

   O que MUDA por unidade é quais formas existem ali. Esta frase dizia
   "as condições são as mesmas em toda a rede" nas dez páginas, e isso é
   falso em Capão da Canoa e Tramandaí, que não trabalham com conta de
   luz. A ressalva é escrita, não omitida: quem pesquisa "celular na
   conta de luz em Tramandaí" precisa da resposta certa na página da
   unidade — inclusive quando a resposta é não. */
function blocoPagamento(loja) {
  const ressalva =
    loja.conta_luz === true
      ? `As condições são as mesmas em toda a rede, e a simulação é presencial —
                aqui em ${texto(loja.cidade)} inclusive.`
      : `Esta unidade <strong class="text-branco">não trabalha com o parcelamento na conta
                de luz</strong>. As demais formas valem normalmente, e a simulação é
                presencial aqui em ${texto(loja.cidade)}.`;

  return `            <article class="cartao p-8">
              <h3 class="text-xl text-branco">Formas de pagamento</h3>
              <p class="mt-3 text-sm leading-relaxed text-prata">
                ${ressalva} Veja os caminhos disponíveis em
                <a class="link-sub text-azul" href="${PREFIXO}como-comprar.html">Como comprar</a>.
              </p>
            </article>`;
}

function corpo(loja) {
  const cartoes = [
    blocoEndereco(loja),
    blocoHorarios(loja),
    blocoWhatsapp(loja),
    blocoInstagram(loja),
    blocoPagamento(loja),
  ]
    .filter(Boolean)
    .join('\n');

  return `      <section class="secao-clara relative overflow-hidden" aria-labelledby="titulo-unidade">
        <div class="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
          <h2 id="titulo-unidade" class="filete-rotulo rotulo mb-12">A unidade</h2>
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal-grupo>
${cartoes}
          </div>

          <p class="mt-12 text-sm leading-relaxed text-prata">
            <a class="link-sub text-azul" href="${PREFIXO}lojas/">Ver todas as unidades da rede</a>
          </p>

${pendenciasDaLoja(loja)}
        </div>
      </section>`;
}

/* ─────────────────────────────────────────────────────────────
   Título, descrição e abertura — únicos por cidade, e todos
   construídos a partir de fato que está no JSON.
   ───────────────────────────────────────────────────────────── */
function metaDaLoja(loja) {
  const cidade = loja.cidade;
  const h = loja.horarios || {};

  /* O nome vem de nomeLoja() — o mesmo que o schema publica em `name` e
     que o <h1> monta. Antes o título dizia "(matriz)", que o schema não
     tinha, e o schema dizia "(Unidade 1)", que o <h1> não tinha.
     "matriz" saiu daqui: é papel na rede, não nome da loja, e continua
     visível no rótulo do topo.

     ─── O FORMATO ───
     Era `${'${nomeLoja}'} — Celulares e acessórios em ${'${cidade}'}/RS`, que
     escrevia a cidade DUAS vezes ("HG Smart Cachoeira do Sul — Celulares
     e acessórios em Cachoeira do Sul/RS": 85 caracteres). O Google corta
     por volta de 60, então a metade útil do título — a marca — sumia do
     resultado justamente na busca em que ela é o diferencial.

     O formato agora é o que a estratégia de SEO local já definia:
     "Loja de celulares em [Cidade] — HG Smart". Começa pelo termo que o
     visitante digita, cabe nos 60 e ainda sobra espaço para a unidade
     entre parênteses onde ela existe. */
  const titulo = `Loja de celulares em ${cidade}${loja.unidade ? ` (${loja.unidade})` : ''} — HG Smart`;

  const horarioCurto = [
    h.semana && h.semana !== 'fechado' ? `Seg a sex ${h.semana}` : null,
    h.sabado && h.sabado !== 'fechado' ? `sábado ${h.sabado}` : null,
    h.domingo && h.domingo !== 'fechado' ? `domingo ${h.domingo}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  const local = [loja.endereco, loja.bairro].filter(Boolean).join(', ');

  /* ─── A regra desta função: só prometer o que a página entrega ───

     Vale para a `description` (o snippet da busca) E para o `intro` (o
     primeiro parágrafo que o visitante lê). Os dois já anunciaram
     "WhatsApp" de forma fixa, inclusive para loja sem número cadastrado.

     No `intro` era pior que na `description`: o parágrafo prometia o
     WhatsApp e, uma rolagem abaixo, o cartão azul dizia "Falta o WhatsApp
     próprio da unidade" — a página se contradizendo à vista. É a mesma
     falha do texto de auditoria: afirmar o que o conteúdo não sustenta. */
  const temZap = Boolean(loja.whatsapp?.length);
  const temHora = temHorario(loja);

  const oferece = [temZap ? 'WhatsApp da unidade' : null, 'link de rota'].filter(Boolean);

  /* A description é montada por prioridade e para de crescer aos 160
     caracteres, que é onde o Google corta o snippet.

     Cachoeirinha batia 163 e perdia o fim da frase no resultado — e o
     fim era justamente "WhatsApp da unidade e link de rota", a parte que
     diz o que a página resolve. A ordem abaixo é a da utilidade para
     quem está pesquisando: quem é e onde fica, depois quando abre,
     depois como falar. O que não couber fica de fora inteiro, em vez de
     entrar pela metade. */
  const LIMITE_DESCRICAO = 160;
  const partes = [
    `${nomeLoja(loja)}: ${local}.`,
    horarioCurto ? `${horarioCurto}.` : null,
    `${oferece.join(' e ').replace(/^./, (c) => c.toUpperCase())}.`,
  ].filter(Boolean);

  let descricao = '';
  for (const parte of partes) {
    const tentativa = descricao ? `${descricao} ${parte}` : parte;
    if (tentativa.length > LIMITE_DESCRICAO) break;
    descricao = tentativa;
  }

  const temNaPagina = ['endereço'];
  if (temHora) temNaPagina.push('horário');
  if (temZap) temNaPagina.push('WhatsApp próprio');

  const ondeFica = loja.matriz ? `da matriz da rede, em ${cidade}` : `da unidade de ${cidade}`;

  const intro =
    `${juntar(temNaPagina).replace(/^./, (c) => c.toUpperCase())} ${ondeFica}. ` +
    'A simulação é presencial e sem compromisso.';

  return { titulo, descricao, intro };
}

/* ═══════════════════════════════════════════════════════════════ */

console.log('\n  Gerando páginas de unidade\n');

let escritas = 0;
for (const loja of lojas) {
  const { titulo, descricao, intro } = metaDaLoja(loja);

  const schema = jsonLdIndentado({ '@context': 'https://schema.org', ...schemaLoja(loja) });

  /* O <h1> soletra o mesmo nome que o schema publica. Cachoeira do Sul é
     a única com `unidade`, e ela ganha a terceira linha — sem isso o
     visível diria "HG Smart Cachoeira do Sul" e a marcação diria
     "HG Smart Cachoeira do Sul (Unidade 1)". */
  const linhasH1 = ['<span class="linha-mask"><span>HG Smart</span></span>'];
  if (loja.unidade) {
    linhasH1.push(`<span class="linha-mask"><span class="text-azul">${texto(loja.cidade)}</span></span>`);
    linhasH1.push(`<span class="linha-mask"><span class="text-prata">${texto(loja.unidade)}.</span></span>`);
  } else {
    linhasH1.push(`<span class="linha-mask"><span class="text-azul">${texto(loja.cidade)}.</span></span>`);
  }

  const html = pagina({
    arquivo: `lojas/${loja.id}/index.html`,
    url: `lojas/${loja.id}/`,
    titulo: atributo(titulo),
    descricao: atributo(descricao),
    rotulo: loja.matriz ? 'Matriz' : 'Unidade',
    // Na trilha vale a cidade: "Início › Lojas › Caxias do Sul" localiza,
    // "Início › Lojas › Unidade" serve para as dez ao mesmo tempo.
    migalha: loja.cidade,
    h1: linhasH1.map((l) => '            ' + l).join('\n'),
    intro: texto(intro),
    corpo: corpo(loja),
    schema,
    atual: 'lojas/', // destaca "Lojas" no menu…
    atualEhExato: false, // …mas a página é a unidade, não /lojas/
    prefixo: PREFIXO,
  });

  const pasta = path.join(RAIZ, 'lojas', loja.id);
  fs.mkdirSync(pasta, { recursive: true });
  fs.writeFileSync(path.join(pasta, 'index.html'), html, 'utf8');

  const kb = Math.round(fs.statSync(path.join(pasta, 'index.html')).size / 1024);
  console.log(`  lojas/${loja.id}/index.html`.padEnd(40) + `${String(kb).padStart(3)}KB`);
  escritas++;
}

console.log(`\n  ${escritas} unidades · ${dados.lojas.length - escritas} fora (em breve)`);
console.log(`  canônica: ${DOMINIO}/lojas/<id>/\n`);
