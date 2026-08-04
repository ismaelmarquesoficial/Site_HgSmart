# Rede HG Smart — site institucional

HTML estático + JavaScript vanilla + Tailwind CSS. Sem WordPress, sem banco de
dados, sem PHP. Sobe em qualquer host estático.

O site é **institucional**: mostra a empresa, as marcas/modelos que as lojas
trabalham e as dez unidades. Não tem carrinho, checkout nem fluxo de compra.

---

## Rodar localmente

```bash
npm install
npm run serve      # http://localhost:4321
```

O servidor local existe por um motivo específico: lojas, catálogo e banners são
lidos com `fetch()` de `data/*.json`, e o navegador bloqueia `fetch` em páginas
abertas via `file://`. Abrir o `index.html` com dois cliques faz os cards não
carregarem.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run build` | Compila o CSS minificado. **Rode antes de publicar** |
| `npm run dev` | Recompila o CSS a cada alteração |
| `npm run serve` | Servidor local em http://localhost:4321 |
| `npm run seo` | Gera `robots.txt`, `sitemap.xml` e o JSON-LD das 10 lojas |
| `npm run paginas` | Regenera as 7 páginas montadas por template |
| `npm run banners` | Reprocessa as artes do slider (WebP + JPEG, 3 tamanhos) |
| `npm run zap` | Sincroniza o botão fixo de WhatsApp nas 5 páginas antigas |

## Mexer no visual

```bash
npm run dev        # recompila o CSS a cada alteração
npm run build      # compila minificado (rode antes de publicar)
```

**O `assets/css/site.css` está commitado de propósito.** Assim o site funciona
como arquivo estático puro, sem exigir Node de quem publica. Mas se você mudar
qualquer classe do Tailwind no HTML, precisa rodar `npm run build` — senão a
classe nova não existe no CSS compilado.

## Publicar

Suba a pasta inteira, menos `node_modules/` e `assets/img/banners/original/`
(são os JPEGs pesados de origem, não usados pelo site).

---

## Estrutura

```
├── index.html                    Home
├── quem-somos.html               História, missão, visão, valores
├── catalogo.html                 As marcas que a rede trabalha (sem preço)
├── servicos.html                 Venda, acessórios, aprovação
├── lojas.html                    As 10 unidades
│                                 (as 5 acima têm header/footer à mão)
│
├── como-comprar.html             6 formas de pagamento    ← gerada
├── faq.html                      9 perguntas frequentes   ← gerada
├── garantia.html                 Garantia estendida       ← gerada
├── ceo.html                      Eduardo Hermes           ← gerada
├── contato.html                  Canais de contato        ← gerada
├── politica-de-privacidade.html  esqueleto jurídico       ← gerada
├── termos-de-uso.html            esqueleto jurídico       ← gerada
│
├── robots.txt                    gerado por npm run seo
├── sitemap.xml                   gerado por npm run seo
│
├── data/
│   ├── lojas.json        10 unidades: endereço, coordenada, WhatsApp, horário
│   ├── catalogo.json      Marcas, marcas parceiras, acessórios (sem preço)
│   └── banners.json      Slider da home
│
├── assets/
│   ├── css/src.css       FONTE do estilo — edite este
│   ├── css/site.css      compilado (não edite à mão)
│   ├── js/site.js        menu, e montagem de lojas/catálogo
│   ├── js/banner.js      slider de banners
│   ├── js/motion.js      camada de animação (GSAP)
│   ├── vendor/           GSAP, ScrollTrigger, Lenis — locais, sem CDN
│   ├── fontes/           Bebas Neue + Inter auto-hospedadas
│   └── img/
│       ├── banners/          processados (webp + jpg, 3 tamanhos)
│       ├── banners/original/ JPEGs de origem, só para reprocessar
│       ├── marcas/           logos do marquee
│       ├── produtos/         logos de 5 das 9 marcas (as outras 4 em marcas/)
│       ├── fotos/            fachada e ambiente
│       └── icones/           logo, favicon, pictogramas
│
└── ferramentas/
    └── processar-banners.js  normaliza e otimiza os banners
```

---

## Editar conteúdo sem tocar em HTML

Quase tudo que muda com frequência está em `data/`.

### Lojas — `data/lojas.json`

Adicionar ou remover uma unidade é editar o array `lojas`. O total exibido na
home e na página de lojas é contado do JSON, não escrito à mão.

Para pegar a coordenada de uma loja nova: abra o Google Maps, clique com o botão
direito no ponto, e copie os dois números.

### Marcas — `data/catalogo.json`

> **O site não mostra preço e não vende.** Decisão do cliente em 2026-07-28: a
> página é institucional e lista apenas as marcas que a rede trabalha. A lista de
> modelos com valores que existia aqui era estrutura de exemplo — nunca foram
> dados reais — e foi removida junto com o código que a renderizava.

- Cada marca tem `id`, `nome`, `logo` e `resumo`. O `id` é a âncora usada pelos
  cards da home (`catalogo.html#samsung`) e pelos filtros do topo
- `marcas_parceiras` é a faixa de logos secundária; `acessorios` é a grade final
- `condicoes_globais` guarda as parcelas máximas (boleto, conta de luz, cartão).
  São condições de pagamento, não preço
- Se um dia a rede quiser listar modelos, o combinado é listar **sem valor** — o
  preço sai da simulação presencial na loja

### Banners — `data/banners.json`

- `"ativo": false` tira um banner do ar sem apagar arquivo
- A ordem do array é a ordem de exibição
- `intervalo_ms` controla a troca automática

Para trocar as artes: coloque os arquivos novos em
`assets/img/banners/original/` seguindo o padrão `desktop-N.jpg` e
`mobile-N.jpg`, e rode:

```bash
npm run banners
```

O script força todos na mesma proporção (desktop `1920×740`, mobile `900×900`)
com corte centralizado, e gera WebP + JPEG em três tamanhos. **Por isso a altura
do slider nunca muda**, mesmo que alguém suba uma arte de proporção diferente.

---

## Pendências do slider

### 1. O banner da Troop Telecom está no ar — e deve estar

Eu tinha desativado esse banner por achar que era anúncio de terceiro. Errado: o
briefing (`Informação.md`, slide 7) diz **"Troop Telecom — Operadora do Grupo
Hermes"**. É empresa irmã. Está com `"ativo": true`.

Fica o registro visual: a arte tem fundo branco e identidade própria da Troop, o
que destoa do resto do slider. É intencional, não bug.

### 2. A arte do banner 6 diz "18X no boleto"

A página de Serviços diz **25x**, e o briefing não especifica. Três fontes, dois
números, nenhuma resposta. Confirme o valor correto e refaça a arte ou ajuste a
copy — hoje o site se contradiz. É o item **B1** do `PLANO-DE-APLICACAO.md`.

### 3. Faltam 4 artes de banner

O briefing descreve 8 slides; existe arte para 4. Faltam: **Crédito CLT**,
**Películas HG Fiber/Premium**, **Capinhas HG Smart** e **Aporte Financeiro**.
O slider já está pronto para recebê-las — é só colocar em
`assets/img/banners/original/`, rodar `npm run banners` e adicionar no JSON.

---

## Decisões técnicas que valem saber

**Nada depende de JavaScript para ser lido.** O CSS entrega o estado final por
padrão. Só depois de confirmar que o visitante aceita movimento é que o JS marca
`<html class="motion-ok">` e o CSS esconde os elementos para o GSAP trazer. Se o
GSAP não carregar, o conteúdo aparece inteiro em vez de ficar invisível.

**Movimento reduzido é respeitado de verdade.** Com
`prefers-reduced-motion: reduce` as animações não rodam, o slider não avança
sozinho (WCAG 2.2.2) e os contadores mostram o valor final direto.

**Sem requisição externa nenhuma.** GSAP, Lenis e as fontes são servidos do
próprio domínio. Nada de `fonts.googleapis.com` nem CDN no caminho crítico.

**Sem chave de API de mapa.** A página de lojas usa link de rota do Google Maps
em vez de mapa embutido. O site antigo expunha uma chave da Google no HTML de
`/lojas` — este não repete isso.

**A seção pinada só pina no desktop.** Em telas pequenas o `pin` do
ScrollTrigger briga com a altura dinâmica da viewport e a barra de endereço do
navegador; abaixo de 1024px cada capítulo revela no lugar.

---

## O que este site corrige do anterior

Medido com SEOmator e o audit de GEO no site antigo, e verificado no navegador
aqui:

| Item | Antes | Agora |
|---|---|---|
| `<h1>` na home | nenhum | 1, único |
| Meta description | ausente em 10 páginas | em todas |
| Imagens sem alt | 70 de 76 | 0 |
| Scroll horizontal no mobile | 68 elementos | nenhum |
| JSON-LD estruturado | nenhum | Organization + WebSite + MobilePhoneStore |
| Open Graph | ausente | completo, com imagem |
| Arquivos CSS | 31 externos | 1 |
| Peso dos banners | 6,7 MB | 1,0 MB (WebP) |
| Chave de API exposta | Google Maps em `/lojas` | nenhuma |

O que **não** está resolvido aqui porque depende do servidor, não do código:
cabeçalhos de segurança (HSTS, CSP, X-Frame-Options, X-Content-Type-Options) e
o redirect HTTP→HTTPS. Precisam ser configurados no host.

---

## Duas dívidas técnicas conhecidas

**1. Cabeçalho e rodapé estão em dois sistemas.** As 7 páginas novas são geradas
por `ferramentas/gerar-paginas.js`, que tem o cabeçalho, o menu, o rodapé e o
botão de WhatsApp num só lugar. As 5 páginas originais (`index`, `quem-somos`,
`catalogo`, `servicos`, `lojas`) ainda têm tudo isso embutido à mão.

Consequência prática: **mudar um item de menu exige editar o gerador e as 5
páginas antigas.** Migrar as 5 para o gerador é a próxima limpeza. Enquanto isso,
o `npm run zap` existe justamente para sincronizar o botão de WhatsApp nelas.

**2. A seção pinada só existe em `quem-somos.html`.** Foi removida da home porque
contava a mesma história da seção "Nossa história", que a home ganhou depois.
O `motion.js` procura `[data-pinada]` e não faz nada quando não encontra — sem erro.

---

## Marcadores de pendência nas páginas

As páginas geradas trazem avisos **visíveis** de conteúdo faltante, em cartão azul
com `data-pendencia`. Isso é deliberado: placeholder invisível vira conteúdo
publicado por esquecimento.

Para achar todos antes de publicar:

    grep -rn "data-pendencia" *.html

Os códigos (`B1`, `B4`, `B12`…) remetem ao `PLANO-DE-APLICACAO.md` na pasta acima,
que lista o que cada um trava.

---

## Correção importante sobre os dados das lojas

O plugin do site antigo usava `"0"` **e** `"1"` (string) para dizer "fechado". Meu
primeiro conversor só tratava o `"1"`, então três lojas ficaram com `"0"` cru no
campo de domingo.

Consequência: eu havia escrito na página de lojas que "domingo as lojas não abrem".
**É falso.** Cachoeirinha abre domingo 09:30–18:30 e Capão da Canoa 13:00–19:00.
Corrigido no `data/lojas.json`, no cartão de cada loja (com selo "Abre no domingo")
e no `openingHoursSpecification` do JSON-LD.

Se você editar horários à mão, use `"fechado"` — nunca `"0"` nem `"1"`.
