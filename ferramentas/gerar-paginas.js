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

/* Cabeçalho, menu, casca do <head>, rodapé e o marcador de pendência
   vivem em layout.js — o mesmo módulo que gerar-lojas.js consome. Isto
   já esteve escrito aqui dentro; virou módulo quando surgiu o segundo
   gerador, para não nascerem duas cascas divergentes.

   Saíram junto três constantes que estavam mortas neste arquivo desde
   que o rodapé passou a vir de aplicar-rodape.js: RODAPE_INSTITUCIONAL,
   REDES e TELEFONES eram declaradas e nunca lidas. */
const { pendencia, pagina, texto, atributo, ZAP_MATRIZ } = require('./layout');

/* As páginas de pagamento precisam saber QUAIS unidades trabalham com
   conta de luz. O dado é o mesmo campo que decide o `paymentAccepted` do
   schema de cada loja — lido daqui para que a página de conta de luz e o
   dado estruturado nunca digam coisas diferentes sobre a mesma unidade. */
const RAIZ_DADOS = path.join(__dirname, '..', 'data');
const LOJAS = JSON.parse(fs.readFileSync(path.join(RAIZ_DADOS, 'lojas.json'), 'utf8')).lojas.filter(
  (l) => !l.em_breve
);
const SEM_CONTA_DE_LUZ = LOJAS.filter((l) => l.conta_luz !== true).map((l) => l.cidade);

/* Instagram e WhatsApp da rede, no rodapé de cada página de pagamento.
   O site não tem formulário nem carrinho: quem quer condição para o SEU
   caso precisa falar com alguém, e a página tem que dizer por onde.

   Aqui é a conta GERAL, porque estas páginas são da rede inteira — o
   boleto não é de uma cidade. Quem quer falar com a loja da sua cidade
   tem o botão "Ver as 10 lojas" ao lado, e cada página de unidade traz o
   WhatsApp e o Instagram daquela loja. */
const INSTAGRAM = 'https://www.instagram.com/hgsmart/';

const RAIZ = path.join(__dirname, '..');

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
    r: 'A página de <a class="link-sub text-azul" href="lojas/">Lojas</a> tem as dez unidades com endereço, horário, WhatsApp e link de rota. Duas delas — Cachoeirinha e Capão da Canoa — abrem no domingo.',
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
  const cards = FORMAS.map(
    (f, i) => `            <article class="cartao ${f.destaque ? 'cartao-azul' : ''} p-8">
              <p class="rotulo">0${i + 1}</p>
              <h3 class="mt-4 text-xl">
                <a class="link-sub" href="${f.arquivo}">${f.nome}</a>
              </h3>
              <p class="mt-3 text-sm leading-relaxed">${f.resumo}</p>
              <p class="mt-4 text-sm"><a class="link-sub ${f.destaque ? '' : 'text-azul'}" href="${f.arquivo}" aria-label="${atributo(`Saiba como funciona: ${f.nome}`)}">Como funciona →</a></p>
            </article>`
  ).join('\n');

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

/* ─── As seis formas de pagamento ────────────────────────────────
   Cada uma vira uma página própria, e as mesmas seis alimentam os
   cards de como-comprar.html. Uma fonte só: mudar o resumo aqui muda
   o card e a página juntos, sem chance de um contradizer o outro.

   POR QUE PÁGINA PRÓPRIA
   "celular no boleto em [cidade]" e "celular na conta de luz" são as
   buscas que a estratégia elegeu como o diferencial da rede. Enquanto
   as seis formas eram seis cartões dentro de uma página, existia UMA
   URL para responder seis perguntas diferentes.

   REGRA DE CONTEÚDO, a mesma das páginas de unidade: toda frase aqui
   sai do material recebido. Onde o dado não existe, entra pendencia()
   — cartão visível — em vez de texto plausível inventado. */
const FORMAS = [
  {
    arquivo: 'boleto.html',
    nome: 'Boleto',
    destaque: true,
    resumo: 'Sem cartão e sem conta em banco. Atende quem está negativado.',
    titulo: 'Celular no boleto, sem cartão nem banco — HG Smart',
    descricao:
      'Parcelamento no boleto na Rede HG Smart: sem cartão de crédito, sem conta em banco, com análise que atende quem está negativado no SPC e no Serasa.',
    h1: ['Boleto', 'sem cartão,', 'sem banco.'],
    intro:
      'É o caminho que mais aprova na rede: não pede cartão de crédito, não pede conta em banco e atende quem outras lojas recusam.',
    blocos: [
      { t: 'Como funciona', d: 'Você escolhe o aparelho na loja, a equipe faz a simulação na hora e, com a análise aprovada, você sai com o celular no mesmo dia. As parcelas vêm por boleto, em frequência quinzenal.' },
      { t: 'Quem pode', d: 'Inclusive quem está negativado no SPC e no Serasa. A rede trabalha com mais de 5 financeiras parceiras, e a análise não exige comprovação de renda.' },
      { t: 'Quantas parcelas', d: 'De 18 a 25 vezes, conforme o aparelho escolhido e o resultado da análise.' },
      { t: 'Precisa de entrada', d: 'Sim — de 10% a 30% do valor, definida na própria simulação.' },
      { t: 'Documentos', d: 'RG e CNH. Não é preciso ter cartão de crédito nem conta em banco.' },
      { t: 'Onde simular', d: 'Presencialmente, em qualquer uma das 10 unidades da rede.' },
    ],
    pendencias: [
      {
        codigo: 'B1',
        texto:
          'O que separa 18x de 25x ainda não está escrito em lugar nenhum. As duas condições existem, mas o material não diz o critério — se é o valor do aparelho, a financeira aprovada, o percentual da entrada ou outra coisa. Enquanto isso, a página informa a faixa (18 a 25) em vez de prometer um número que pode não valer para o cliente à frente do vendedor.',
      },
    ],
  },
  {
    arquivo: 'conta-de-luz.html',
    nome: 'Conta de luz',
    resumo: 'A parcela entra na fatura de energia, em até 24 vezes e sem entrada.',
    titulo: 'Celular na conta de luz — até 24x sem entrada — HG Smart',
    descricao:
      'Parcelamento do celular na conta de luz da Rede HG Smart: até 24 vezes, sem entrada, para cidades atendidas pela RGE.',
    h1: ['A parcela', 'na conta', 'de luz.'],
    intro:
      'A prestação entra junto na fatura de energia que você já paga todo mês. É a única forma da rede que dispensa entrada.',
    blocos: [
      { t: 'Como funciona', d: 'O valor do aparelho é dividido e cobrado dentro da sua fatura de energia, em até 24 vezes. Não há boleto separado nem carnê.' },
      { t: 'Precisa de entrada', d: 'Não. É a única forma de pagamento da rede sem entrada.' },
      { t: 'Quem pode', d: 'Clientes atendidos pela RGE. A aprovação é facilitada e atende também quem está negativado.' },
      { t: 'Onde simular', d: 'Presencialmente, nas unidades que trabalham com esta modalidade.' },
    ],
    // A lista de unidades sem conta de luz é montada em tempo de geração,
    // a partir do mesmo campo do JSON que controla o schema das lojas.
    listaSemContaDeLuz: true,
    pendencias: [
      {
        codigo: 'B2',
        texto:
          'Faltam dois dados que o cliente pergunta na loja: existe teto de valor para financiar na conta de luz, e a conta precisa estar no nome de quem está comprando? Nenhum dos dois está no material recebido.',
      },
    ],
  },
  {
    arquivo: 'credito-clt.html',
    nome: 'Crédito CLT',
    resumo: 'Linha de crédito para quem tem carteira assinada.',
    titulo: 'Crédito CLT — celular para quem tem carteira — HG Smart',
    descricao:
      'Crédito CLT na Rede HG Smart: linha de crédito para trabalhadores com carteira assinada, sujeita a análise, simulada na loja.',
    h1: ['Crédito', 'para quem tem', 'carteira assinada.'],
    intro:
      'Uma linha de crédito voltada a trabalhadores CLT. A condição é levantada na simulação presencial, sem compromisso.',
    blocos: [
      { t: 'Quem pode', d: 'Trabalhadores com carteira assinada. A concessão é sujeita a análise.' },
      { t: 'Onde simular', d: 'Presencialmente, em qualquer uma das 10 unidades da rede.' },
    ],
    pendencias: [
      {
        codigo: 'B4',
        texto:
          'Esta é a forma de pagamento com menos informação disponível. Faltam a mecânica (como o crédito é liberado e cobrado), a financeira parceira, os limites de valor e o prazo máximo. Sem isso a página não tem como responder o que o cliente vai perguntar — e escrever por aproximação seria inventar condição de crédito, que é o tipo de erro que não se conserta depois da venda.',
      },
    ],
  },
  {
    arquivo: 'cartao-de-credito.html',
    nome: 'Cartão de crédito',
    resumo: 'Em até 10 vezes sem juros, para quem já tem limite disponível.',
    titulo: 'Celular no cartão — até 10x sem juros — HG Smart',
    descricao:
      'Compra de celular no cartão de crédito na Rede HG Smart: em até 10 vezes sem juros, para quem já tem limite disponível.',
    h1: ['No cartão,', '10 vezes', 'sem juros.'],
    intro:
      'Para quem já tem limite no cartão, é o caminho mais direto: sem análise de crédito, sem entrada e sem juros.',
    blocos: [
      { t: 'Como funciona', d: 'A compra é parcelada em até 10 vezes sem juros no seu cartão de crédito, com o limite que você já tem disponível.' },
      { t: 'Quem pode', d: 'Qualquer cliente com cartão de crédito e limite suficiente. Não passa por análise das financeiras.' },
      { t: 'Destaque', d: 'É a condição mais usada nos Androids da rede — Samsung, Xiaomi, Motorola e Realme.' },
      { t: 'Onde comprar', d: 'Presencialmente, em qualquer uma das 10 unidades da rede.' },
    ],
    /* "Sem juros" é promessa de preço, então não entrou por dedução: o
       Documento Cérebro e o vendas-pagamento.md dizem os dois "até 10x
       sem juros", e nenhuma fonte contradiz. O antigo marcador B3 pedia
       exatamente essa confirmação e foi retirado por já estar respondido. */
    pendencias: [],
  },
  {
    arquivo: 'a-vista.html',
    nome: 'Pix ou dinheiro',
    resumo: 'À vista, com desconto no valor. É a forma mais barata de fechar.',
    titulo: 'Celular à vista no Pix — com desconto — HG Smart',
    descricao:
      'Compra à vista de celular na Rede HG Smart: Pix ou dinheiro, com desconto no valor do aparelho.',
    h1: ['À vista,', 'com', 'desconto.'],
    intro:
      'Quem fecha no Pix ou em dinheiro paga menos. Sem análise, sem parcela e sem burocracia.',
    blocos: [
      { t: 'Como funciona', d: 'Você paga o valor integral no Pix ou em dinheiro e leva o aparelho na hora, com desconto sobre o preço.' },
      { t: 'Quem pode', d: 'Qualquer cliente. Não há análise de crédito nem exigência de documento além do necessário para a nota.' },
      { t: 'Onde comprar', d: 'Presencialmente, em qualquer uma das 10 unidades da rede.' },
    ],
    pendencias: [
      {
        codigo: 'B7',
        texto:
          'O percentual do desconto à vista não está definido no material. A página fala em desconto sem número, porque anunciar um percentual que a loja não pratica gera atrito no balcão.',
      },
    ],
  },
  {
    arquivo: 'troca-do-usado.html',
    nome: 'Troca do usado',
    resumo: 'Seu aparelho atual vira parte do pagamento do novo.',
    titulo: 'Troca do celular usado — abate no novo | HG Smart',
    descricao:
      'Troca do celular usado na Rede HG Smart: o aparelho é avaliado na loja e o valor abate no preço do novo.',
    h1: ['Seu usado', 'abate no', 'aparelho novo.'],
    intro:
      'O celular que você já tem é avaliado na loja e o valor entra como parte do pagamento do novo.',
    blocos: [
      { t: 'Como funciona', d: 'A equipe avalia o seu aparelho na própria loja e o valor apurado abate no preço do novo. O que sobrar pode ser fechado em qualquer uma das outras formas de pagamento.' },
      { t: 'Onde avaliar', d: 'Presencialmente, em qualquer uma das 10 unidades da rede. A avaliação é feita com o aparelho em mãos.' },
    ],
    pendencias: [
      {
        codigo: 'B5',
        texto:
          'Faltam os critérios da avaliação: quais marcas e modelos são aceitos, que estado de conservação entra, se aparelho com tela trincada ou bloqueado é aceito, e se existe valor mínimo. São exatamente as perguntas que o cliente faz antes de sair de casa com o aparelho antigo.',
      },
    ],
  },
];

/* ─── Corpo de uma página de forma de pagamento ──────────────────
   Três partes: os blocos de dúvida real (como funciona / quem pode /
   documentos), o aviso por unidade quando a forma não vale em todas, e
   o bloco de contato.

   O aviso da conta de luz é escrito, não omitido. Quem pesquisa "celular
   na conta de luz em Tramandaí" precisa da resposta certa mesmo quando a
   resposta é não — descobrir isso no balcão é pior. */
function corpoForma(f) {
  const cards = f.blocos
    .map(
      (b) => `            <article class="cartao p-8">
              <h3 class="text-xl text-branco">${texto(b.t)}</h3>
              <p class="mt-3 text-sm leading-relaxed text-prata">${texto(b.d)}</p>
            </article>`
    )
    .join('\n');

  const aviso =
    f.listaSemContaDeLuz && SEM_CONTA_DE_LUZ.length
      ? `          <aside class="cartao cartao-azul mt-10 p-7">
            <p class="rotulo">Disponibilidade por unidade</p>
            <p class="mt-3 text-sm leading-relaxed">
              O parcelamento na conta de luz <strong>não está disponível</strong> nas unidades de
              ${texto(listaLegivel(SEM_CONTA_DE_LUZ))}. Nas demais ${LOJAS.length - SEM_CONTA_DE_LUZ.length} unidades da rede, sim.
            </p>
          </aside>`
      : '';

  return `      <section class="secao-clara relative overflow-hidden" aria-labelledby="titulo-forma">
        <div class="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
          <h2 id="titulo-forma" class="filete-rotulo rotulo mb-12">Como funciona</h2>
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal-grupo>
${cards}
          </div>
${aviso}
${f.pendencias.map((p) => pendencia(p.codigo, p.texto)).join('\n')}
        </div>
      </section>

      <section class="relative overflow-hidden" aria-labelledby="titulo-falar">
        <div class="relative z-10 mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
          <h2 id="titulo-falar" class="filete-rotulo rotulo mb-12">Tirar dúvida antes de ir</h2>
          <p class="max-w-2xl text-base leading-relaxed text-prata">
            A condição exata sai da simulação presencial, mas dúvida sobre documento, prazo
            ou disponibilidade dá para resolver antes — pelo WhatsApp ou pelo Instagram da rede.
          </p>
          <div class="mt-10 flex flex-wrap gap-4">
            <a class="btn btn-azul" href="https://wa.me/${ZAP_MATRIZ}?text=${encodeURIComponent(
              `Olá! Quero saber mais sobre ${f.nome.toLowerCase()} na HG Smart.`
            )}" target="_blank" rel="noopener noreferrer">Perguntar no WhatsApp</a>
            <a class="btn" href="${INSTAGRAM}" target="_blank" rel="noopener noreferrer">Perguntar no Instagram</a>
            <a class="btn" href="lojas/">Ver as 10 lojas</a>
          </div>
        </div>
      </section>

      <!-- As outras cinco formas. Serve a quem está comparando (a pergunta
           real do cliente é "qual delas eu consigo?", não "como funciona
           o boleto"), e de quebra tira estas páginas de um único link de
           entrada vindo do como-comprar. -->
      <section class="secao-clara relative overflow-hidden" aria-labelledby="titulo-outras">
        <div class="relative z-10 mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
          <h2 id="titulo-outras" class="filete-rotulo rotulo mb-10">Outras formas de pagar</h2>
          <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal-grupo>
${FORMAS.filter((o) => o.arquivo !== f.arquivo)
  .map(
    (o) => `            <li class="cartao p-7">
              <h3 class="text-lg text-branco"><a class="link-sub" href="${o.arquivo}">${texto(o.nome)}</a></h3>
              <p class="mt-2 text-sm leading-relaxed text-prata">${texto(o.resumo)}</p>
            </li>`
  )
  .join('\n')}
          </ul>
          <p class="mt-10 text-sm">
            <a class="link-sub text-azul" href="como-comprar.html">Ver as seis lado a lado →</a>
          </p>
        </div>
      </section>`;
}

/* "Capão da Canoa e Tramandaí" — vírgulas até o penúltimo, "e" no último.
   Existe porque a lista sai do JSON e pode ter 1, 2 ou 8 nomes. */
function listaLegivel(itens) {
  if (itens.length <= 1) return itens[0] || '';
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
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
    url: 'como-comprar.html',
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
    url: 'faq.html',
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
    url: 'garantia.html',
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
    url: 'ceo.html',
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
    url: 'contato.html',
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
          d: 'As dez unidades têm número próprio — algumas têm mais de um. A lista completa está na página de <a class="link-sub text-azul" href="lojas/">Lojas</a>.',
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
    url: 'politica-de-privacidade.html',
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
    url: 'termos-de-uso.html',
    titulo: 'Termos de Uso — Rede HG Smart',
    descricao: 'Condições de uso do site institucional da Rede HG Smart: finalidade das informações publicadas, propriedade da marca e limites de responsabilidade.',
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
    url: 'politica-de-cookies.html',
    titulo: 'Política de Cookies — Rede HG Smart',
    descricao: 'Quais cookies o site da Rede HG Smart utiliza, para que servem e como gerenciá-los no navegador. Hoje o site é estático e não grava cookie algum.',
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

  /* As seis páginas de forma de pagamento, derivadas de FORMAS. Ficam no
     fim da lista só por ordem de leitura — a ordem aqui não afeta nada,
     cada página é escrita de forma independente. */
  ...FORMAS.map((f) => ({
    arquivo: f.arquivo,
    url: f.arquivo,
    titulo: f.titulo,
    descricao: f.descricao,
    rotulo: f.nome,
    h1: [
      `            <span class="linha-mask"><span>${f.h1[0]}</span></span>`,
      `            <span class="linha-mask"><span class="texto-contorno">${f.h1[1]}</span></span>`,
      `            <span class="linha-mask"><span class="text-azul">${f.h1[2]}</span></span>`,
    ].join('\n'),
    intro: f.intro,
    corpo: corpoForma(f),
  })),
];

console.log('\n  Gerando páginas\n');
for (const p of PAGINAS) {
  fs.writeFileSync(path.join(RAIZ, p.arquivo), pagina(p), 'utf8');
  const kb = Math.round(fs.statSync(path.join(RAIZ, p.arquivo)).size / 1024);
  console.log(`  ${p.arquivo.padEnd(30)} ${String(kb).padStart(3)}KB`);
}
console.log('');
