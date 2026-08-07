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
const { pendencia, pagina } = require('./layout');

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
