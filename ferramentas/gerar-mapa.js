/**
 * Gera o mapa do Rio Grande do Sul em SVG: silhueta branca, as 497
 * divisões municipais em preto, e os municípios com loja em azul.
 * Com aparência de laje 3D.
 *
 * FONTE: malhas oficiais do IBGE (API v3) em ferramentas/dados-mapa/.
 * Nada aqui é desenhado à mão.
 *   - rs-municipios.geojson  malha do RS dividida por município (497)
 *   - rs.geojson             contorno do estado (para a laje e o vinco)
 *   - <id>.json              malha municipal, para centroide de cidade
 *                            sem coordenada de loja
 *
 * COMO O 3D É FEITO
 * A inclinação está na PROJEÇÃO, não num `transform: rotateX` do CSS.
 * Motivo: com rotateX o navegador achata tudo junto, e os marcadores de
 * cidade viram elipses deitadas. Aqui o plano do mapa é comprimido na
 * vertical por cos(inclinação) e os marcadores são desenhados depois, em
 * pé, como alfinete cravado — que é como um mapa 3D de verdade se lê.
 *
 * A espessura da laje é feita por cópias empilhadas do contorno, de baixo
 * para cima, escurecendo. É mais barato que gerar parede por segmento e,
 * nesta escala, indistinguível.
 *
 * Uso: npm run mapa
 */

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const DADOS = path.join(__dirname, 'dados-mapa');

/* ─── Parâmetros do desenho ──────────────────────────────────── */

const LARGURA = 1100;
const MARGEM = 30;

const INCLINACAO = 52; // graus de vista; 0 = mapa chapado de cima
const ESPESSURA = 26; // altura da laje em px projetados
const CAMADAS = 7; // cópias empilhadas que formam a parede
const TOLERANCIA = 1.3; // simplificação em px — acima disso a divisa começa a sujar

const COR_TOPO = '#ffffff';
const COR_DIVISA = '#0b0b0c';
const COR_AZUL = '#00a2c7';
const COR_AZUL_ESCURO = '#00506b';
const COR_LAJE = '#04070a';

/* ─── Geometria ──────────────────────────────────────────────── */

function aneisDe(geometria) {
  if (geometria.type === 'Polygon') return geometria.coordinates;
  if (geometria.type === 'MultiPolygon') return geometria.coordinates.flat();
  throw new Error(`geometria não suportada: ${geometria.type}`);
}

/* Centroide por área. A média simples de vértices puxa o ponto para onde
   há mais detalhe de contorno e sai visivelmente do centro. */
function centroide(aneis) {
  let area = 0;
  let cx = 0;
  let cy = 0;

  for (const anel of aneis) {
    for (let i = 0; i < anel.length - 1; i++) {
      const [x0, y0] = anel[i];
      const [x1, y1] = anel[i + 1];
      const cruz = x0 * y1 - x1 * y0;
      area += cruz;
      cx += (x0 + x1) * cruz;
      cy += (y0 + y1) * cruz;
    }
  }

  if (area === 0) {
    const pts = aneis.flat();
    return [
      pts.reduce((s, p) => s + p[0], 0) / pts.length,
      pts.reduce((s, p) => s + p[1], 0) / pts.length,
    ];
  }

  area *= 0.5;
  return [cx / (6 * area), cy / (6 * area)];
}

/* Douglas-Peucker. Sem isto o SVG passa de 140KB: a malha do IBGE tem
   muito mais vértice do que 1100px de largura consegue mostrar. */
function simplificar(pontos, tolerancia) {
  if (pontos.length < 3) return pontos;

  const distSq = ([px, py], [x0, y0], [x1, y1]) => {
    let dx = x1 - x0;
    let dy = y1 - y0;
    if (dx !== 0 || dy !== 0) {
      const t = ((px - x0) * dx + (py - y0) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        return (px - x1) ** 2 + (py - y1) ** 2;
      }
      if (t > 0) {
        return (px - (x0 + dx * t)) ** 2 + (py - (y0 + dy * t)) ** 2;
      }
    }
    return (px - x0) ** 2 + (py - y0) ** 2;
  };

  const tolSq = tolerancia * tolerancia;

  const recursivo = (ini, fim, saida) => {
    let maxDist = 0;
    let indice = -1;
    for (let i = ini + 1; i < fim; i++) {
      const d = distSq(pontos[i], pontos[ini], pontos[fim]);
      if (d > maxDist) {
        maxDist = d;
        indice = i;
      }
    }
    if (maxDist > tolSq) {
      if (indice - ini > 1) recursivo(ini, indice, saida);
      saida.push(pontos[indice]);
      if (fim - indice > 1) recursivo(indice, fim, saida);
    }
  };

  const saida = [pontos[0]];
  recursivo(0, pontos.length - 1, saida);
  saida.push(pontos[pontos.length - 1]);
  return saida;
}

/* ─── Leitura das malhas ─────────────────────────────────────── */

const municipios = JSON.parse(
  fs.readFileSync(path.join(DADOS, 'rs-municipios.geojson'), 'utf8')
).features;

const contornoEstado = aneisDe(
  JSON.parse(fs.readFileSync(path.join(DADOS, 'rs.geojson'), 'utf8')).features[0].geometry
);

const lojasJson = JSON.parse(fs.readFileSync(path.join(RAIZ, 'data', 'lojas.json'), 'utf8'));

const IBGE = {
  'Santa Cruz do Sul': '4316808',
  Lajeado: '4311403',
  'Cachoeira do Sul': '4303004',
  'Capão da Canoa': '4304630',
  'Caxias do Sul': '4305108',
  Cachoeirinha: '4303103',
  Tramandaí: '4321600',
  'Santa Maria': '4316907',
  Farroupilha: '4307906',
  'Bento Gonçalves': '4302105',
  Pelotas: '4314407',
};

const cidades = lojasJson.lojas.map((loja) => {
  const codigo = IBGE[loja.cidade];
  if (!codigo) throw new Error(`sem código do IBGE para ${loja.cidade}`);

  let lng;
  let lat;
  let origem;

  if (loja.coord) {
    ({ lng, lat } = loja.coord);
    origem = 'coordenada da loja';
  } else {
    const malha = JSON.parse(fs.readFileSync(path.join(DADOS, `${codigo}.json`), 'utf8'));
    [lng, lat] = centroide(aneisDe(malha.features[0].geometry));
    origem = 'centroide do município';
  }

  return { ...loja, codigo, lng, lat, origem, emBreve: !!loja.em_breve };
});

const codigosComLoja = new Set(cidades.filter((c) => !c.emBreve).map((c) => c.codigo));
const codigoEmBreve = new Set(cidades.filter((c) => c.emBreve).map((c) => c.codigo));

/* ─── Projeção inclinada ─────────────────────────────────────── */

const todos = contornoEstado.flat();
const lngMin = Math.min(...todos.map((p) => p[0]));
const lngMax = Math.max(...todos.map((p) => p[0]));
const latMin = Math.min(...todos.map((p) => p[1]));
const latMax = Math.max(...todos.map((p) => p[1]));

// 1° de longitude é mais curto que 1° de latitude nesta faixa
const fatorLng = Math.cos((((latMin + latMax) / 2) * Math.PI) / 180);
// Compressão vertical que produz a sensação de olhar o plano de viés
const fatorVista = Math.cos((INCLINACAO * Math.PI) / 180);

const escala = (LARGURA - MARGEM * 2) / ((lngMax - lngMin) * fatorLng);
const alturaPlano = (latMax - latMin) * escala * fatorVista;

const ALTURA = Math.round(alturaPlano + MARGEM * 2 + ESPESSURA);

const projetar = ([lng, lat]) => [
  MARGEM + (lng - lngMin) * fatorLng * escala,
  MARGEM + (latMax - lat) * escala * fatorVista,
];

const arred = (n) => Math.round(n * 10) / 10;

function paraCaminho(aneis, tolerancia = TOLERANCIA, deslocaY = 0) {
  return aneis
    .map((anel) => {
      const projetados = anel.map(projetar);
      const simples = simplificar(projetados, tolerancia);
      const pts = simples.map(([x, y]) => `${arred(x)},${arred(y + deslocaY)}`);
      return `M${pts.join('L')}Z`;
    })
    .join('');
}

/* ─── Montagem ───────────────────────────────────────────────── */

const caminhoEstado = paraCaminho(contornoEstado);

// Parede da laje: cópias do contorno subindo, da mais escura à mais clara
const paredes = [];
for (let i = CAMADAS; i >= 1; i--) {
  const dy = (ESPESSURA * i) / CAMADAS;
  const luz = 0.1 + (1 - i / CAMADAS) * 0.22;
  paredes.push(
    `    <path d="${paraCaminho(contornoEstado, TOLERANCIA * 2.2, dy)}" fill="${COR_LAJE}" fill-opacity="${arred(luz + 0.55)}" />`
  );
}

// Divisas municipais + preenchimento azul de quem tem loja
const divisas = [];
const destaques = [];
let vertices = 0;

for (const f of municipios) {
  const codigo = f.properties.codarea;
  const aneis = aneisDe(f.geometry);
  vertices += aneis.flat().length;
  const d = paraCaminho(aneis);

  if (codigosComLoja.has(codigo)) {
    destaques.push(`    <path class="mun-loja" d="${d}" />`);
  } else if (codigoEmBreve.has(codigo)) {
    destaques.push(`    <path class="mun-em-breve" d="${d}" />`);
  } else {
    divisas.push(`    <path d="${d}" />`);
  }
}

/* ─────────────────────────────────────────────────────────────
   RÓTULOS DAS CIDADES

   No lugar do alfinete vai o nome. Um ponto pequeno permanece marcando
   a coordenada exata — sem ele o rótulo diria a cidade mas não o lugar,
   e três dos municípios são vizinhos colados na serra.

   O problema real aqui é COLISÃO: Caxias do Sul, Bento Gonçalves e
   Farroupilha ficam a poucos pixels um do outro nesta escala. Rótulos
   centrados nos pontos se sobreporiam e nenhum seria legível. A rotina
   abaixo empurra os que colidem e desenha uma linha-guia ligando o
   rótulo deslocado ao seu ponto.
   ───────────────────────────────────────────────────────────── */

/* Alfinete em pé, todos da mesma altura.

   O corpo NÃO é comprimido pela projeção inclinada — é isso que faz
   parecer objeto cravado sobre a superfície, e não mancha pintada nela.

   Os nomes das cidades já estiveram aqui e foram removidos a pedido.
   O que sumiu junto: a Bebas Neue embutida em base64, a folga de 96px no
   topo do quadro e o algoritmo que variava a altura da haste para
   separar rótulos vizinhos. Se os nomes voltarem, tudo isso volta —
   ferramentas/subset-fonte-mapa.py continua no lugar por esse motivo. */
const alfinetes = cidades
  .map((c) => {
    const [x, y] = projetar([c.lng, c.lat]);
    const haste = c.emBreve ? 24 : 30;
    const rCabeca = c.emBreve ? 6 : 7.5;
    const yCabeca = y - haste;
    const classe = c.emBreve ? 'alfinete alfinete-em-breve' : 'alfinete';

    return `    <g class="${classe}" data-cidade="${c.id}">
      <ellipse class="sombra" cx="${arred(x)}" cy="${arred(y)}" rx="${arred(rCabeca * 1.2)}" ry="${arred(rCabeca * 0.45)}" />
      <line class="haste" x1="${arred(x)}" y1="${arred(y)}" x2="${arred(x)}" y2="${arred(yCabeca)}" />
      <circle class="cabeca" cx="${arred(x)}" cy="${arred(yCabeca)}" r="${rCabeca}" />
    </g>`;
  })
  .join('\n');

const nomesComLoja = cidades.filter((c) => !c.emBreve).map((c) => c.cidade);
const nomesEmBreve = cidades.filter((c) => c.emBreve).map((c) => c.cidade);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LARGURA} ${ALTURA}" role="img" aria-labelledby="mapa-titulo mapa-desc">
  <title id="mapa-titulo">Mapa do Rio Grande do Sul com as cidades atendidas pela Rede HG Smart</title>
  <desc id="mapa-desc">Mapa em relevo do estado, branco, com as divisas dos 497 municípios em preto. ${nomesComLoja.length} municípios com loja destacados em azul e marcados com alfinete: ${nomesComLoja.join(', ')}. ${nomesEmBreve.join(', ')} aparece como unidade em breve.</desc>

  <style>
    /* O branco do mapa é um degradê a 155°, o mesmo ângulo e a mesma
       lógica dos cartões e da abertura do site: claro num canto,
       recebendo o azul da marca no oposto. Chapado ele destoava do
       resto da página. */
    .divisas {
      fill: url(#degrade-topo);
      stroke: ${COR_DIVISA};
      stroke-width: 0.6;
      stroke-opacity: 0.5;
      stroke-linejoin: round;
    }
    .mun-loja {
      fill: url(#degrade-azul);
      stroke: ${COR_AZUL_ESCURO};
      stroke-width: 0.9;
      stroke-linejoin: round;
    }
    .mun-em-breve {
      fill: url(#degrade-em-breve);
      stroke: ${COR_AZUL_ESCURO};
      stroke-width: 0.9;
      stroke-dasharray: 3 2.5;
      stroke-linejoin: round;
    }
    /* Eco do halo-azul da abertura: brilho radial por cima da face.
       Sem mix-blend-mode, que não é confiável quando o SVG é carregado
       como imagem — só opacidade baixa, que funciona em todo lugar.

       ATENÇÃO ao editar comentários daqui: SVG é XML, então um sinal de
       menor-que solto no texto (o nome de uma tag HTML escrito no meio
       da frase, por exemplo) quebra o parse do arquivo inteiro. Já
       aconteceu. */
    .brilho { fill: url(#halo-azul); }
    .borda-estado {
      fill: none;
      stroke: ${COR_DIVISA};
      stroke-width: 1.8;
      stroke-linejoin: round;
    }

    /* ─── Pino ─────────────────────────────────────────────── */

    .sombra { fill: #04070a; fill-opacity: .35; }

    .haste {
      stroke: ${COR_AZUL_ESCURO};
      stroke-width: 2.4;
    }

    .cabeca {
      fill: ${COR_AZUL};
      stroke: #ffffff;
      stroke-width: 2.4;
    }

    .alfinete-em-breve .nome   { fill: ${COR_AZUL_ESCURO}; }
    .alfinete-em-breve .haste  { stroke-dasharray: 4 3; }
    .alfinete-em-breve .cabeca { fill: #ffffff; stroke: ${COR_AZUL_ESCURO}; }

    @media (prefers-reduced-motion: no-preference) {
      .alfinete { animation: fincar .9s cubic-bezier(.16,1,.3,1) backwards; }
      .alfinete:nth-of-type(2n) { animation-delay: .12s; }
      .alfinete:nth-of-type(3n) { animation-delay: .24s; }
      @keyframes fincar {
        from { opacity: 0; transform: translateY(-16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    }
  </style>

  <defs>
    <!-- 155° em coordenadas de gradiente: x1/y1 → x2/y2 -->
    <linearGradient id="degrade-topo" x1="0.12" y1="0" x2="0.88" y2="1">
      <stop offset="0" stop-color="#ffffff" />
      <stop offset="0.42" stop-color="#f4fbfd" />
      <stop offset="1" stop-color="#cfeaf3" />
    </linearGradient>

    <linearGradient id="degrade-azul" x1="0.12" y1="0" x2="0.88" y2="1">
      <stop offset="0" stop-color="#3dc0dd" />
      <stop offset="1" stop-color="#00a2c7" />
    </linearGradient>

    <linearGradient id="degrade-em-breve" x1="0.12" y1="0" x2="0.88" y2="1">
      <stop offset="0" stop-color="#d8f2f9" />
      <stop offset="1" stop-color="#a8dced" />
    </linearGradient>

    <!-- Mesmo desenho do .halo-azul da abertura: azul no centro
         dissolvendo a 62% do raio.

         A opacidade é baixa de propósito. Em 0,34 o nordeste do estado
         ficava tão azul que os municípios COM LOJA (Caxias, Bento,
         Farroupilha, justamente ali) deixavam de se destacar do fundo.
         O brilho é ambiente; o azul saturado tem que ser só informação. -->
    <radialGradient id="halo-azul" cx="0.74" cy="0.14" r="0.6">
      <stop offset="0" stop-color="${COR_AZUL}" stop-opacity="0.17" />
      <stop offset="0.62" stop-color="${COR_AZUL}" stop-opacity="0" />
    </radialGradient>

    <!-- Recorta o brilho na silhueta do estado, para ele não vazar -->
    <clipPath id="corte-estado">
      <path d="${caminhoEstado}" />
    </clipPath>
  </defs>

  <!-- Espessura da laje -->
  <g>
${paredes.join('\n')}
  </g>

  <!-- Face de cima: municípios com divisa preta -->
  <g class="divisas">
${divisas.join('\n')}
  </g>

  <!-- Municípios com loja -->
  <g>
${destaques.join('\n')}
  </g>

  <!-- Brilho azul da abertura, recortado no estado -->
  <g clip-path="url(#corte-estado)">
    <rect class="brilho" x="0" y="0" width="${LARGURA}" height="${ALTURA}" />
  </g>

  <!-- Borda do estado, mais grossa que as divisas internas -->
  <path class="borda-estado" d="${caminhoEstado}" />

  <!-- Alfinetes das cidades atendidas -->
  <g>
${alfinetes}
  </g>
</svg>
`;

const destino = path.join(RAIZ, 'assets', 'img', 'mapa-rs.svg');
fs.writeFileSync(destino, svg, 'utf8');

console.log(`\n  mapa-rs.svg — ${LARGURA}x${ALTURA}, ${Math.round(svg.length / 1024)}KB`);
console.log(`  inclinação ${INCLINACAO}°, laje ${ESPESSURA}px em ${CAMADAS} camadas`);
console.log(`  ${municipios.length} municípios, ${vertices} vértices na origem, simplificados a ${TOLERANCIA}px`);
console.log(`  destacados: ${destaques.length} (${codigosComLoja.size} com loja + ${codigoEmBreve.size} em breve)\n`);

// Confere que nenhum município com loja ficou sem ser encontrado na malha
const achados = new Set(
  municipios.map((f) => f.properties.codarea).filter((c) => codigosComLoja.has(c) || codigoEmBreve.has(c))
);
for (const c of cidades) {
  if (!achados.has(c.codigo)) {
    console.log(`  ATENÇÃO: ${c.cidade} (${c.codigo}) não foi encontrado na malha municipal`);
  }
}
