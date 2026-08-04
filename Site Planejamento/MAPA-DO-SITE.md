# Mapa do site — Rede HG Smart

> ⚠️ **DOCUMENTO HISTÓRICO — não use como fonte de verdade.**
>
> Escrito em 2026-07-27. Partes já não correspondem ao código atual.
> Exemplos: diz que a home tem 9 seções (hoje tem 11 — a esteira de depoimentos e a seção "Nosso foco" entraram depois) e que o catálogo tem preços de exemplo (removidos em 2026-07-28).
>
> **Fonte única de acompanhamento: [CHECKLIST.md](CHECKLIST.md).**
> Este arquivo fica como registro do que foi levantado na época.

---

Levantamento da estrutura do site novo (`hgsmart-novo/`), extraído dos arquivos
em 2026-07-27. Nada aqui foi escrito de memória: seções, contagens e pesos vêm
da varredura dos próprios HTML.

**Resumo:** 13 páginas · 268 KB de HTML · 3 arquivos de dados · ~5 MB publicáveis.

---

## Sumário

1. [Árvore de arquivos](#1-árvore-de-arquivos)
2. [Navegação](#2-navegação)
3. [Página por página, com mockup](#3-página-por-página-com-mockup)
4. [Rodapé](#4-rodapé)
5. [Camada de dados](#5-camada-de-dados)
6. [Sistema visual](#6-sistema-visual)
7. [Peso e desempenho](#7-peso-e-desempenho)
8. [Ferramentas](#8-ferramentas)
9. [Estado de cada página](#9-estado-de-cada-página)
10. [Riscos e pendências](#10-riscos-e-pendências)

---

## 1. Árvore de arquivos

```
hgsmart-novo/
│
│  ── PÁGINAS (13) ─────────────────────────────────────────────
├── index.html                    39KB   9 seções · 11 cards · 14 img
├── quem-somos.html               25KB   7 seções ·  6 cards
├── catalogo.html                 20KB   5 seções ·  4 cards ·  9 img
├── servicos.html                 22KB   5 seções · 14 cards
├── como-comprar.html             16KB   2 seções ·  6 cards      ← esqueleto
├── lojas.html                    40KB   4 seções ·  3 cards ·  3 img
├── faq.html                      19KB   2 seções · 10 cards      ← esqueleto
├── garantia.html                 14KB   2 seções               ← esqueleto
├── ceo.html                      14KB   2 seções               ← esqueleto
├── contato.html                  15KB   2 seções ·  5 cards      ← esqueleto
├── politica-de-privacidade.html  15KB                          ← esqueleto
├── termos-de-uso.html            14KB                          ← esqueleto
├── politica-de-cookies.html      15KB                          ← esqueleto · ÓRFÃ
│
│  ── SEO ──────────────────────────────────────────────────────
├── robots.txt                           gerado · libera bots de citação de IA
├── sitemap.xml                          gerado · 13 URLs
│
│  ── DADOS (a fonte da verdade) ───────────────────────────────
├── data/
│   ├── lojas.json           8KB   11 unidades (10 abertas + Pelotas)
│   ├── catalogo.json        8KB   5 marcas · 9 parceiras · 5 acessórios
│   └── banners.json         4KB   7 banners
│
│  ── ASSETS ───────────────────────────────────────────────────
├── assets/
│   ├── css/
│   │   ├── src.css                 ← FONTE. Edite este.
│   │   └── site.css         56KB   ← compilado. Não edite à mão.
│   ├── js/
│   │   ├── site.js                 menu mobile, cards de loja, catálogo
│   │   ├── banner.js               slider de banners
│   │   └── motion.js               camada de animação (GSAP)
│   ├── vendor/             136KB   GSAP + ScrollTrigger + Lenis (locais)
│   ├── fontes/              68KB   Bebas Neue + Inter (auto-hospedadas)
│   └── img/
│       ├── mapa-rs.svg     128KB   497 municípios, gerado da malha do IBGE
│       ├── banners/       2716KB   7 artes × 3 tamanhos × 2 formatos
│       │   └── original/           JPEGs de origem — NÃO PUBLICAR
│       ├── fotos/                  fachada1 · img11 (fundador) · img22
│       │   └── nao-usadas/         órfãs — NÃO PUBLICAR
│       ├── marcas/                 9 logos do marquee
│       ├── produtos/               5 logos das marcas principais
│       └── icones/                 logo, favicon, 3 pictogramas
│
│  ── FERRAMENTAS (nada aqui vai para o ar) ────────────────────
└── ferramentas/
    ├── gerar-paginas.js            npm run paginas
    ├── aplicar-rodape.js           npm run rodape
    ├── gerar-seo.js                npm run seo
    ├── gerar-mapa.js               npm run mapa
    ├── processar-banners.js        npm run banners
    ├── inserir-zap.js              npm run zap
    ├── previa-mapa.js              conferência visual do mapa
    ├── subset-fonte-mapa.py        reservado (rótulos no mapa)
    └── dados-mapa/                 malhas do IBGE + fonte recortada
```

---

## 2. Navegação

```
MENU DO TOPO (5)              RODAPÉ · INSTITUCIONAL (6)
  Início                        Início
  A rede            ◄──┐        Quem Somos       ◄──┐   MESMA PÁGINA,
  Catálogo             │        Serviços            │   NOME DIFERENTE
  Serviços             └────────────────────────────┘
  Lojas                         Catálogo
  [botão] Ver as lojas          Lojas
                                Blog ↗ (WordPress, fora do site novo)
```

### Páginas fora de qualquer menu

Sete páginas só são alcançáveis por link dentro de outra página:

| Página | Chega-se por |
|---|---|
| `como-comprar.html` | rodapé do gerador, links internos |
| `faq.html` | links internos |
| `garantia.html` | links internos |
| `ceo.html` | links internos |
| `contato.html` | links internos |
| `politica-de-privacidade.html` | faixa legal do rodapé |
| `termos-de-uso.html` | faixa legal do rodapé |
| `politica-de-cookies.html` | **nenhum lugar** — órfã |

---

## 3. Página por página, com mockup

### 3.1 `index.html` — Home · 9 seções

```
╔══════════════════════════════════════════════════════════════════╗
║ [logo]   Início  A rede  Catálogo  Serviços  Lojas  (Ver lojas)  ║ fixo z-50
╠══════════════════════════════════════════════════════════════════╣
║ ① HERO                                        ▓ foto img11 ▓     ║
║   REDE HG SMART · RIO GRANDE DO SUL           ▓ (o fundador)▓    ║ 92svh
║                                               ▓ + gradiente ▓    ║
║   TECNOLOGIA                                  ▓ + halo azul ▓    ║
║   NÃO DEVIA SER      ← contorno vazado                           ║
║   PRIVILÉGIO.        ← azul da marca                             ║
║                                                                  ║
║   Nasceu de uma ideia simples e ambiciosa…                       ║
║   [Ver o catálogo]  [Conhecer a rede]                            ║
╠══════════════════════════════════════════════════════════════════╣
║ ② NOSSA HISTÓRIA                             ░░ SEÇÃO CLARA ░░   ║
║   ─── nossa história                                             ║
║   01 (número fantasma)                                           ║
║   NASCEU DE UM SONHO       │  ┌── foto img22 (fachada) ──┐       ║
║   SIMPLES, MAS MUITO       │  └──────────────────────────┘       ║
║   AMBICIOSO.               │  ┌──── 7 ────┐ ┌─ Garantia ─┐       ║
║   3 parágrafos             │  │ card AZUL │ │ card PRETO │       ║
║   [Conhecer a rede inteira]│  └───────────┘ └────────────┘       ║
╠══════════════════════════════════════════════════════════════════╣
║ ③ ▓▓▓ marquee 9 marcas · inverte no sentido do scroll ▓▓▓       ║
╠══════════════════════════════════════════════════════════════════╣
║ ④ A REDE HOJE                                   02 (fantasma)    ║
║   ┌ 10 ─┐ ┌ 25x ┐ ┌ 5+ ─┐ ┌ 9 ─┐   ← contadores animados        ║
║   unidades boleto  financ. marcas                                ║
╠══════════════════════════════════════════════════════════════════╣
║ ⑤ SLIDER DE BANNERS      ◄  ●●●●●●●  ►      7 artes · 6,5s      ║
║   proporção travada 1920/740 · cada slide inteiro é link         ║
║   pausa no hover, no foco e com a aba em segundo plano           ║
╠══════════════════════════════════════════════════════════════════╣
║ ⑥ FORMAS DE PAGAMENTO                           03 (fantasma)    ║
║   QUATRO CAMINHOS / PARA O MESMO LUGAR                           ║
║   ┌ 25x AZUL ┐ ┌ 24x ┐ ┌ 10x ┐ ┌ Pix ┐                           ║
║     boleto      luz     cartão  desconto                         ║
╠══════════════════════════════════════════════════════════════════╣
║ ⑦ MARCAS E MODELOS                           ░░ SEÇÃO CLARA ░░   ║
║   ┌Samsung┐┌Apple┐┌Xiaomi┐┌Motorola┐┌Realme┐   [Abrir catálogo]  ║
╠══════════════════════════════════════════════════════════════════╣
║ ⑧ DEZ UNIDADES, UM JEITO SÓ DE ATENDER          05 (fantasma)    ║
║   ┌ loja 1 ┐ ┌ loja 2 ┐ ┌ loja 3 ┐   ← lojas.json · limite 3     ║
║   [Todas as lojas]                                               ║
╠══════════════════════════════════════════════════════════════════╣
║ ⑨ PASSE NUMA LOJA. A CONVERSA É SEM COMPROMISSO.   (centralizado)║
║   [Encontrar a loja mais perto]  [Ver os serviços]               ║
╠══════════════════════════════════════════════════════════════════╣
║   RODAPÉ (ver §4)                                                ║
╚══════════════════════════════════════════════════════════════════╝
                                          (•) WhatsApp fixo · z-45
```

### 3.2 `lojas.html` — a página mais rica · 4 seções

```
║ ① HERO COM MAPA                                                  ║
║   ─── lojas · rio grande do sul   ▓▓▓▓ MAPA DO RS ▓▓▓▓           ║
║   DEZ UNIDADES.                   ▓ 497 divisas municipais ▓     ║
║   SEMPRE PRESENCIAL.              ▓ 10 municípios em azul  ▓     ║
║   A simulação e a análise…        ▓ pinos + laje 3D (52°)  ▓     ║
║   ● 10 cidades com loja           ▓ sangra pelas bordas    ▓     ║
║   ◌ Pelotas — em breve                                           ║
║                                                                  ║
║   ┌─ COMPORTAMENTO NO HOVER DO MAPA ──────────────────────────┐  ║
║   │ centraliza na seção (desvio x = 0)                        │  ║
║   │ avança 90px em Z, dentro de perspective 1400px            │  ║
║   │ véu da direita → opacidade 0                              │  ║
║   │ TEXTO DO HERO → opacidade 0 + visibility hidden           │  ║
║   │ z-index 30: acima do conteúdo, abaixo do menu (z-50)      │  ║
║   │ só com (hover: hover) e (pointer: fine)                   │  ║
║   └───────────────────────────────────────────────────────────┘  ║
╟──────────────────────────────────────────────────────────────────╢
║ ② TODAS AS UNIDADES               10 lojas · 10 cidades          ║
║   ┌───────────────┐┌───────────────┐┌───────────────┐            ║
║   │ Santa Cruz    ││ Lajeado       ││ Cachoeira ·   │            ║
║   │ RS · Matriz  ●││ RS           ●││ Unidade 1    ●│            ║
║   │ endereço      ││               ││               │            ║
║   │ complemento   ││               ││               │            ║
║   │ Seg a sex     ││               ││               │            ║
║   │ Sábado        ││               ││               │            ║
║   │ WhatsApp × 4  ││ × 2           ││ × 2           │            ║
║   │ Como chegar   ││ Como chegar   ││ (por endereço)│            ║
║   └───────────────┘└───────────────┘└───────────────┘            ║
║   … mais 7 · o último é PELOTAS, tracejado, "Em breve"           ║
╟──────────────────────────────────────────────────────────────────╢
║ ③ LEVE RG E CNH. O RESTO A GENTE RESOLVE.    ░░ SEÇÃO CLARA ░░   ║
║   ┌ Documento ┐ ┌ Sem cartão ┐ ┌ Se tiver, melhor ┐              ║
╟──────────────────────────────────────────────────────────────────╢
║ ④ NÃO ACHOU SUA CIDADE?          [Ver o catálogo][Ver serviços]  ║
```

### 3.3 `catalogo.html` · 5 seções

```
║ ① HERO  CINCO MARCAS. / UMA CONDIÇÃO PARA CADA BOLSO.            ║
╟── barra fixa: Samsung · Apple · Xiaomi · Motorola · Realme ──────╢ sticky
║   ▼ tudo abaixo é montado de data/catalogo.json                  ║
║                                                                  ║
║   [logo] SAMSUNG                                    4 modelos    ║
║   ┌ Galaxy A06 ┐┌ A16 5G ─────┐┌ A36 5G ┐┌ S24 FE ┐              ║
║   │ ⌐entrada⌐  ││ ⌐mais busc.⌐││        ││ ⌐topo⌐ │ ← tag        ║
║   │ 64 GB      ││ 128 GB      ││ 256 GB ││ 256 GB │              ║
║   │ a partir de││             ││        ││        │              ║
║   │ R$ 749     ││ R$ 1.199    ││R$ 1.799││R$ 3.299│              ║
║   │ 25x R$39,90││ 25x R$63,90 ││        ││        │              ║
║   └────────────┘└─────────────┘└────────┘└────────┘              ║
║                                                                  ║
║   APPLE (4) · XIAOMI (4) · MOTOROLA (4) · REALME (3)             ║
╟──────────────────────────────────────────────────────────────────╢
║ ② O PREÇO É UM. O CAMINHO É SEU.             ░░ SEÇÃO CLARA ░░   ║
║   ┌ 25x ┐┌ 24x ┐┌ 10x ┐┌ Pix ┐                                   ║
╟──────────────────────────────────────────────────────────────────╢
║ ③ ACESSÓRIOS       5 cards vindos do JSON                        ║
║ ④ ▓▓▓ marquee 9 marcas parceiras ▓▓▓                            ║
║ ⑤ VIU UM MODELO? SIMULE NA LOJA.                                 ║
```

> **Atenção:** os 19 modelos e todos os preços são **estrutura de exemplo**.
> Nunca existiram no site antigo, que só tinha as 5 marcas.

### 3.4 `quem-somos.html` · 7 seções

```
║ ① HERO  COMEÇOU ATENDENDO / QUEM NINGUÉM ATENDIA.                ║
║ ② 3 contadores: 10 unidades · 10 cidades · 5+ financeiras        ║
║ ③ NOSSA HISTÓRIA, EM TRÊS ATOS          {SEÇÃO PINADA}           ║
║   ─ ─ ─  indicadores de capítulo                                 ║
║   01 A primeira loja      │   ┌─────────────┐                    ║
║   02 A expansão pelo RS   │   │  aparelho   │ ← gira 0° → 180°   ║
║   03 A rede consolidada   │   │  vetorial   │   conforme o scroll║
║      (um por vez)         │   └─────────────┘   só em ≥1024px    ║
║ ④ APARELHO COM PROCEDÊNCIA. ESTADO DECLARADO.    3 cards         ║
║ ⑤ LOJA FÍSICA, ATENDIMENTO DE GENTE.  banner fachada + ken burns ║
║ ⑥ MISSÃO · VISÃO · VALORES                       3 cards         ║
║ ⑦ EXPANSÃO, CONEXÃO E LIBERDADE.             ░░ SEÇÃO CLARA ░░   ║
```

### 3.5 `servicos.html` · 5 seções

```
║ ① HERO  TRÊS SERVIÇOS. / ZERO BUROCRACIA.                        ║
║ ② 01  VENDA DE CELULARES        ┌25x┐┌24x┐┌10x┐┌Pix┐             ║
║       [Fazer a simulação presencial]                             ║
║ ③ 02  ACESSÓRIOS E TECNOLOGIA   6 cards      ░░ CLARA ░░         ║
║ ④ 03  APROVAÇÃO FACILITADA      4 cards                          ║
║ ⑤ A SIMULAÇÃO NÃO CUSTA NADA.                                    ║
```

### 3.6 Páginas-esqueleto

```
┌── como-comprar.html ─────────────────────────────────────────────┐
│ ① HERO  SEIS FORMAS / DE SAIR COM / O CELULAR NOVO.              │
│ ② SEIS CAMINHOS                                                  │
│   ┌ 01 Pix ┐┌ 02 Cartão ┐┌ 03 Boleto ┐┌ 04 Luz ┐┌ 05 CLT ┐┌ 06 ┐│
│   │   ok   ││    B3     ││   AZUL/B1 ││   B2   ││ VAZIO  ││B5  ││
└──────────────────────────────────────────────────────────────────┘

┌── faq.html ──────────────────────────────────────────────────────┐
│ ② 9 accordions · 4 com aviso de pendência                        │
│   ▸ Como funciona o boleto?              B1                      │
│   ▸ Como funciona a conta de luz?        B2                      │
│   ▸ Como funciona o Crédito CLT?         B4 · RESPOSTA VAZIA     │
│   ▸ Posso comprar negativado?            ✓ respondida            │
│   ▸ Quais documentos preciso?            ✓ respondida            │
│   ▸ Como faço uma simulação?             ✓ respondida            │
│   ▸ Como encontro a loja mais próxima?   ✓ respondida            │
│   ▸ Como funciona a garantia?            B6                      │
│   ▸ Como funciona a troca do usado?      B5 · RESPOSTA VAZIA     │
│   ⚠ FAQPage schema NÃO publicado até as respostas fecharem       │
└──────────────────────────────────────────────────────────────────┘

┌── garantia.html ── seção vazia + aviso B6                        │
┌── ceo.html ─────── seção vazia + aviso B9 (Eduardo Hermes)       │
┌── contato.html ─── canais ok · falta formulário e ticket (B13)   │
┌── 3 páginas legais ── esqueleto + aviso B12 (precisa de advogado)│
```

---

## 4. Rodapé

Idêntico nas 13 páginas. Fonte única: `ferramentas/aplicar-rodape.js`.

```
╔══════════════════════════════════════════════════════════════════╗
║ [LOGO]       INSTITUCIONAL  REDES      CONTATO       MATRIZ      ║
║ Rede de      Início         Instagram  (51)9 9857…   Razão Social║
║ lojas de     Quem Somos     Facebook   (51)9 2003…   HG Smart    ║
║ celulares    Serviços       TikTok     (51)9 9017…   LTDA        ║
║ no RS.       Catálogo       YouTube                              ║
║ Tecnologia   Lojas          WhatsApp   contato@      CNPJ        ║
║ acessível,   Blog ↗                    hgsmart.      54.988.129/ ║
║ garantia                               com.br        0001-89     ║
║ oficial e                                                        ║
║ condições                                            R. Marechal ║
║ reais.                                               Floriano,829║
║                                                      Centro      ║
║                                                      SCS/RS      ║
║                                                      CEP 96.810- ║
║                                                      052         ║
║ ─────────────────────── 32px ─────────────────────────────────── ║
║             Política de Privacidade • Termos de Uso              ║
║ ─────────────────────── 32px ─────────────────────────────────── ║
║   © 2026 HG Smart LTDA • Todos os direitos • CNPJ 54.988.129…    ║
╚══════════════════════════════════════════════════════════════════╝
```

Proporção das colunas: `1.5fr 1fr 1fr 1.2fr 1.4fr`. A da marca é maior porque
carrega texto corrido; as demais são listas curtas.

---

## 5. Camada de dados

Tudo que muda com frequência está em `data/`. Nada disso é editado em HTML.

```
data/lojas.json ──┬──► cards de loja (home: 3 · lojas: todas)
                  ├──► contadores "10 unidades" / "10 cidades"
                  ├──► JSON-LD 10× MobilePhoneStore    npm run seo
                  └──► pinos do mapa SVG               npm run mapa

data/catalogo.json ──┬──► blocos de marca + cards de modelo
                     ├──► barra de filtros por marca
                     └──► cards de acessórios

data/banners.json ──► slider da home
                      lê de assets/img/banners/        npm run banners
```

**Consequência prática:** mudar uma loja de endereço afeta quatro saídas
diferentes. Basta editar o JSON e rodar `npm run seo && npm run mapa`.

### Conteúdo de `lojas.json`

| Cidade | Matriz | WhatsApp | Coordenada |
|---|---|---|---|
| Santa Cruz do Sul | sim | 4 | real |
| Lajeado | | 2 | real |
| Cachoeira do Sul (Unidade 1) | | 2 | falta |
| Capão da Canoa | | 2 | real |
| Caxias do Sul | | 2 | real |
| Cachoeirinha | | 2 | real |
| Tramandaí | | 2 | real |
| Santa Maria | | 2 | falta |
| Farroupilha | | 2 | falta |
| Bento Gonçalves | | 2 | real |
| Pelotas | | — | em breve |

Sem coordenada, o link "Como chegar" usa o endereço como busca no Google Maps
e o botão mostra "(por endereço)".

---

## 6. Sistema visual

### Paleta

Três cores, tiradas da identidade real — o azul veio dos pixels do logo.

| Token | Valor | Uso |
|---|---|---|
| `preto` | `#000000` | fundo base |
| `preto-alto` | `#06080b` | superfície elevada |
| `branco` | `#ffffff` | tinta principal |
| `prata` | `#a7b2bc` | tinta secundária |
| `cinza` | `#737e88` | tinta terciária |
| `azul` | `#00a2c7` | ação e ênfase |
| `azul-escuro` | `#00506b` | profundidade |

### Contraste medido (WCAG AA)

| | sobre preto | sobre branco |
|---|---|---|
| `text-branco` | 21,0:1 | 20,2:1 |
| `text-prata` | 9,7:1 | 7,9:1 |
| `text-cinza` | 5,1:1 | 5,9:1 |
| botão e card azul | 7,0:1 | 7,0:1 |

O botão azul usa **tinta preta**, não branca: branco sobre `#00A2C7` dá 3,0:1 e
reprova para texto pequeno.

### Seção clara

`.secao-clara` inverte os tokens de tinta. Um `text-branco` dentro dela vira
preto, um `border-branco/10` vira borda escura. O mesmo componente serve nos
dois fundos, sem markup diferente.

### Elementos visuais recorrentes

- **Halos** — brilhos radiais azuis nos cantos
- **Números fantasma** — 01 a 05 em contorno, gigantes, marcando seções
- **Granulado** — textura fina de filme sobre os fundos
- **Contorno tipográfico** — uma palavra por título vazada
- **Filete rotulado** — divisor que carrega o rótulo da seção

### Tipografia

- **Display:** Bebas Neue (h1–h4, condensada, caixa-alta)
- **Corpo:** Inter variável (400–700)
- Ambas auto-hospedadas — nenhuma requisição a `fonts.googleapis.com`

---

## 7. Peso e desempenho

| Item | Tamanho |
|---|---|
| **Total publicável** | **~5 MB** |
| Banners (7 × 3 tamanhos × 2 formatos) | 2.716 KB |
| `mapa-rs.svg` | 128 KB (44 KB com gzip) |
| vendor (GSAP + ScrollTrigger + Lenis) | 136 KB |
| HTML das 13 páginas | 268 KB |
| Fontes auto-hospedadas | 68 KB |
| CSS compilado | 56 KB |
| JS próprio | 48 KB |

O navegador **não** baixa os 2,7 MB de banner: o `<picture>` escolhe um tamanho
e um formato por slide.

### Não publicar

- `node_modules/`
- `ferramentas/`
- `assets/img/banners/original/`
- `assets/img/fotos/nao-usadas/`

---

## 8. Ferramentas

| Comando | O que faz |
|---|---|
| `npm run build` | compila o CSS minificado — **rode antes de publicar** |
| `npm run dev` | recompila o CSS a cada alteração |
| `npm run serve` | servidor local em http://localhost:4321 |
| `npm run seo` | gera `robots.txt`, `sitemap.xml` e o JSON-LD das lojas |
| `npm run mapa` | regenera o mapa do RS a partir do `lojas.json` |
| `npm run paginas` | regenera as 8 páginas montadas por template |
| `npm run rodape` | reescreve o rodapé nas 13 páginas |
| `npm run banners` | reprocessa as artes do slider |
| `npm run zap` | sincroniza o botão fixo de WhatsApp |

O servidor local existe porque lojas, catálogo e banners são lidos com `fetch`
de `data/*.json`, e o navegador bloqueia `fetch` em página aberta via `file://`.

---

## 9. Estado de cada página

| Página | Estado | Falta |
|---|---|---|
| `index.html` | pronta | — |
| `quem-somos.html` | pronta | dados de crescimento |
| `catalogo.html` | pronta **com dado de exemplo** | modelos e preços reais |
| `servicos.html` | pronta | números confirmados |
| `lojas.html` | pronta | 4 coordenadas, fotos por loja |
| `como-comprar.html` | esqueleto | B1 · B2 · B3 · B4 · B5 |
| `faq.html` | esqueleto | B1 · B2 · B4 · B5 · B6 + schema |
| `garantia.html` | esqueleto | B6 — tudo |
| `ceo.html` | esqueleto | B9 — texto e vídeo |
| `contato.html` | quase | B13 — formulário e ticket |
| 3 páginas legais | esqueleto | B12 — redação jurídica |

Os códigos (`B1`, `B4`, …) remetem ao `PLANO-DE-APLICACAO.md`.

Para achar todos os avisos antes de publicar:

```bash
grep -rn 'data-pendencia' *.html
```

---

## 10. Riscos e pendências

### Riscos de conteúdo

**1. Preços inventados no catálogo.**
Os 19 modelos e todas as faixas de preço são estrutura de exemplo. É o único
conteúdo do site que afirma algo que ninguém verificou. Publicar como está
significa publicar preço falso.

**2. Política de Cookies órfã.**
A página existe e está no `sitemap.xml`, mas nenhuma página linka para ela. O
Google indexa, o usuário não chega. Ou volta para a faixa legal do rodapé, ou o
arquivo e a entrada do sitemap saem.

**3. Mesma página, dois nomes.**
O menu do topo chama de **"A rede"**; o rodapé chama de **"Quem Somos"**.

**4. Contradição de parcelas.**
A arte do banner 6 diz **18x no boleto**. A página de Serviços diz **25x**. O
briefing não especifica. Três fontes, dois números.

### Pendências de dados das lojas

- **Cachoeira do Sul** mudou de endereço em relação ao site antigo, e a lista de
  WhatsApp a chama de "Unidade 1" — mudou de lugar ou são duas lojas?
- **Santa Cruz do Sul**: o primeiro WhatsApp veio com 12 dígitos; foi corrigido
  para 13 supondo que faltava um 9. Precisa ser testado.
- **Farroupilha** está sem número no endereço.
- **4 lojas sem coordenada**: Cachoeira do Sul, Santa Maria, Farroupilha e Bento
  Gonçalves.

### Dívidas técnicas

**Cabeçalho em dois sistemas.** As 8 páginas geradas têm cabeçalho e menu vindos
de `gerar-paginas.js`; as 5 originais têm tudo embutido à mão. Mudar um item de
menu exige editar os dois lugares. O rodapé já foi unificado; o cabeçalho não.

**4 artes de banner faltando.** O briefing descreve 8 slides; existe arte para 4.
Faltam Crédito CLT, Películas HG Fiber/Premium, Capinhas HG Smart e Aporte
Financeiro.

### Fora do código — precisa ser feito no servidor

- Cabeçalhos de segurança: HSTS, CSP, X-Frame-Options, X-Content-Type-Options
- Redirect HTTP → HTTPS (hoje o site antigo redireciona HTTP para HTTP)
- Revogar a chave da Google Maps API exposta no `/lojas` do site atual
- URLs sem `.html`
- IDs de GA4, GTM, Pixel Meta e verificação do Search Console
