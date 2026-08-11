/**
 * O `MobilePhoneStore` de uma unidade — fonte única.
 *
 * POR QUE ESTE ARQUIVO EXISTE
 * Este schema é emitido em dois lugares: no índice `lojas/index.html`
 * (as 10 unidades num @graph, via gerar-seo.js) e em cada
 * `lojas/<id>/index.html` (uma unidade, via gerar-lojas.js). Copiar a
 * montagem para o segundo gerador criaria duas versões do mesmo dado
 * estruturado, e a divergência entre elas não daria erro nenhum — só
 * marcação inconsistente sobre a mesma entidade, que é pior.
 *
 * ─── A REGRA QUE NÃO PODE SE PERDER NA EXTRAÇÃO ───
 * Campo sem dado real SAI do objeto; nunca vai vazio nem preenchido por
 * aproximação. `geo` com coordenada chutada põe a loja no lugar errado
 * no mapa do Google, e `postalCode` vazio é marcação que não corresponde
 * ao conteúdo. As duas coisas são conteúdo local enganoso, que o Google
 * trata no nível do domínio, não da página.
 */

const { DOMINIO } = require('./layout');

/* Os horários vêm agrupados na fonte (semana / sabado / domingo), que é
   como a HG Smart divulga. O schema.org quer os dias nomeados. */
const FAIXAS = {
  semana: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  sabado: ['Saturday'],
  domingo: ['Sunday'],
};

function horariosSchema(horarios) {
  if (!horarios) return [];

  const saida = [];
  for (const [faixaNome, dias] of Object.entries(FAIXAS)) {
    const valor = horarios[faixaNome];
    if (!valor || valor === 'fechado') continue;

    const [abre, fecha] = valor.split('-').map((s) => s.trim());
    saida.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dias.length === 1 ? dias[0] : dias,
      opens: abre,
      closes: fecha,
    });
  }
  return saida;
}

/* A URL canônica da unidade. Era `${DOMINIO}/lojas#${id}` — uma âncora
   dentro do índice — porque a página da unidade não existia. Agora
   existe, e o @id passa a ser ela. O índice e a própria página emitem o
   mesmo @id de propósito: é uma entidade só, com um identificador só. */
function urlLoja(loja) {
  return `${DOMINIO}/lojas/${loja.id}/`;
}

/* O nome da unidade, em UM lugar.
   Antes o schema dizia "HG Smart — Cachoeira do Sul (Unidade 1)" enquanto o
   <h1> dizia "HG Smart Cachoeira do Sul" e o <title> chamava a matriz de
   "(matriz)", que o schema não tinha. Nome divergente entre marcação e
   conteúdo visível é o mesmo problema de NAP que estas páginas existem para
   evitar, só que em escala menor — então título, <h1> e `name` passam a sair
   todos daqui.

   "matriz" ficou de fora de propósito: é um papel dentro da rede, não parte
   do nome da loja. Continua visível no rótulo do topo da página. */
function nomeLoja(loja) {
  return `HG Smart ${loja.cidade}${loja.unidade ? ` (${loja.unidade})` : ''}`;
}

/* JSON-LD indentado e pronto para ir dentro de <script>.

   O `</script` escapado importa: JSON.stringify não faz isso, e uma string
   com essa sequência fecharia a tag mais cedo, derrubando o resto da página.
   Nenhum campo tem isso hoje, mas os dados vêm de um JSON que outra pessoa
   edita — a proteção é de uma linha. */
function jsonLdIndentado(objeto, recuo = '      ') {
  return JSON.stringify(objeto, null, 2)
    .replace(/<\/(script)/gi, '<\\/$1')
    .split('\n')
    .map((linha) => recuo + linha)
    .join('\n');
}

/* A conta de luz NÃO existe em toda a rede: Capão da Canoa e Tramandaí
   não a oferecem. Enquanto isto era uma constante, as dez páginas
   declaravam a mesma lista, e as duas do litoral anunciavam — em dado
   estruturado, que é o que alimenta o Maps e as respostas de IA — uma
   forma de pagamento que aquelas lojas não fazem. O cliente chegava na
   loja com a conta na mão.

   Sem o campo `conta_luz` a oferta SAI da lista, nunca entra por
   omissão. É a mesma regra do `geo` e do `postalCode`: unidade nova cujo
   dado ninguém confirmou anuncia de menos, não de mais. */
function pagamentosAceitos(loja) {
  const formas = ['Boleto', 'Pix', 'Cartão de crédito'];
  if (loja.conta_luz === true) formas.push('Conta de luz');
  return formas.join(', ');
}

function schemaLoja(loja) {
  const zap = loja.whatsapp?.[0];

  const endereco = {
    '@type': 'PostalAddress',
    streetAddress: [loja.endereco, loja.complemento].filter(Boolean).join(' — '),
    addressLocality: loja.cidade,
    addressRegion: loja.uf,
    addressCountry: 'BR',
  };
  // Sem CEP a chave sai do objeto em vez de ir vazia
  if (loja.cep) endereco.postalCode = loja.cep;

  const item = {
    '@type': 'MobilePhoneStore',
    '@id': urlLoja(loja),
    name: nomeLoja(loja),
    parentOrganization: { '@id': `${DOMINIO}/#organizacao` },
    url: urlLoja(loja),
    ...(zap ? { telephone: `+${zap.numero}` } : {}),
    address: endereco,
    openingHoursSpecification: horariosSchema(loja.horarios),
    currenciesAccepted: 'BRL',
    paymentAccepted: pagamentosAceitos(loja),
    areaServed: { '@type': 'City', name: loja.cidade },
  };

  /* `sameAs` liga esta página ao perfil da PRÓPRIA unidade. É o que
     ajuda o Google a entender que a página, o Instagram e o Perfil da
     Empresa daquela cidade são a mesma entidade — e não três lojas.

     Perfil da rede aqui seria pior que nada: diria ao Google que as dez
     unidades são a mesma conta, exatamente a confusão que as páginas por
     unidade existem para desfazer. Sem perfil próprio, a chave sai. */
  if (loja.instagram) {
    item.sameAs = [`https://www.instagram.com/${loja.instagram}/`];
  }

  // `geo` só entra com coordenada real. Inventar ponto aproximado
  // colocaria a loja no lugar errado no mapa do Google.
  if (loja.coord) {
    item.geo = {
      '@type': 'GeoCoordinates',
      latitude: Number(loja.coord.lat.toFixed(7)),
      longitude: Number(loja.coord.lng.toFixed(7)),
    };
  }

  return item;
}

module.exports = {
  FAIXAS,
  horariosSchema,
  pagamentosAceitos,
  schemaLoja,
  urlLoja,
  nomeLoja,
  jsonLdIndentado,
};
