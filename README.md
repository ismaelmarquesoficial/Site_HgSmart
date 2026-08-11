# Rede HG Smart — site institucional

HTML, CSS e JavaScript. Só isso. **Sem Node, sem build, sem geradores.**

O site é **institucional**: mostra a empresa, as marcas que as lojas trabalham,
as seis formas de pagamento e as dez unidades. Não tem carrinho, checkout nem
fluxo de compra.

---

## Rodar

Dê **duplo clique no `index.html`**. É isso.

Não precisa de servidor, de `npm install` nem de nada instalado. Todo o conteúdo
está escrito dentro dos arquivos `.html` — nenhuma página busca dados em tempo de
visita.

> Isto mudou em 2026-08-11. Antes, lojas, catálogo, depoimentos e banners eram
> montados por JavaScript a partir de `data/*.json` com `fetch()`, e o navegador
> bloqueia `fetch` em `file://` — o site só abria com um servidor local rodando.
> Também significava que o buscador precisava executar JavaScript para enxergar
> os cartões de loja. As duas coisas acabaram.

## Publicar

Suba a pasta inteira para a hospedagem. Não há passo de compilação.

---

## Estrutura

```
├── index.html                    Home
├── quem-somos.html               História, missão, visão, valores
├── catalogo.html                 As marcas que a rede trabalha (sem preço)
├── servicos.html                 Venda, acessórios, aprovação
├── lojas/index.html              Índice das 10 unidades
├── lojas/<cidade>/index.html     Uma página por unidade (10)
│
├── como-comprar.html             As seis formas, lado a lado
├── boleto.html                   ┐
├── conta-de-luz.html             │
├── credito-clt.html              │ uma página por forma
├── cartao-de-credito.html        │ de pagamento
├── a-vista.html                  │
├── troca-do-usado.html           ┘
│
├── faq.html                      9 perguntas frequentes
├── garantia.html                 Garantia estendida
├── ceo.html                      Eduardo Hermes
├── contato.html                  Canais de contato
├── politica-de-privacidade.html  ┐
├── termos-de-uso.html            │ esqueleto jurídico
├── politica-de-cookies.html      ┘
├── 404.html                      Página de erro
│
├── robots.txt
├── sitemap.xml
│
└── assets/
    ├── css/site.css          O estilo, num arquivo só
    ├── js/site.js            Menu mobile, ano do rodapé, faixa de depoimentos
    ├── js/banner.js          Controles do slider
    ├── js/motion.js          Animação (GSAP)
    ├── vendor/               GSAP, ScrollTrigger, Lenis — locais, sem CDN
    ├── fontes/               Bebas Neue + Inter, auto-hospedadas
    └── img/
```

---

## Editar conteúdo

**O conteúdo está no HTML, e só no HTML.** Para mudar o horário de uma loja, o
endereço, um WhatsApp ou o texto de uma seção, edite a página onde aquilo
aparece. Não há banco, JSON de dados nem painel — o arquivo é a fonte.

### O preço disso: repetição

Alguns dados aparecem em mais de um lugar, e o navegador não vai avisar quando
um deles ficar para trás. Os pontos que exigem atenção:

| O que muda | Onde precisa mexer |
|---|---|
| Dados de uma loja | `lojas/<cidade>/index.html`, o cartão dela em `lojas/index.html` e — se estiver entre as 3 da home — em `index.html` |
| **Horário/endereço da matriz** | os dois acima **e** o JSON-LD no `<head>` do `index.html` |
| Menu | as 30 páginas |
| Rodapé | as 30 páginas |
| Um banner do slider | `index.html` |

É a troca consciente por não ter etapa de geração: publicar ficou trivial,
manter ficou manual.

### Mudar o visual

`assets/css/site.css` é o CSS final, escrito à mão a partir de agora. Ele foi
gerado com Tailwind até 2026-08-11 — por isso os nomes de classe parecem
utilitários (`mt-10`, `text-branco`, `grid-cols-3`).

**Consequência:** usar uma classe do Tailwind que ainda não esteja no arquivo
não faz nada, porque não há mais quem a compile. Ou você reaproveita as classes
que já existem, ou escreve a regra nova no `site.css` na mão.

---

## Decisões que valem saber

**O conteúdo não depende de JavaScript.** Texto, cartões de loja, depoimentos e
banners estão no HTML. O JS cuida do menu mobile, do movimento da faixa de
depoimentos, dos controles do slider e da animação.

**Movimento reduzido é respeitado.** Com `prefers-reduced-motion: reduce` as
animações não rodam, o slider não avança sozinho (WCAG 2.2.2) e a faixa de
depoimentos fica parada — ainda arrastável.

**Nenhuma requisição externa.** GSAP, Lenis e as fontes são servidos do próprio
domínio. Nada de `fonts.googleapis.com`, CDN, analytics ou pixel.

**Nenhum cookie.** Sem login, sem carrinho, sem sessão, sem medição.

**Sem chave de API de mapa.** As páginas de loja usam link de rota do Google
Maps em vez de mapa embutido — o site antigo expunha uma chave no HTML.

**A seção pinada só pina no desktop.** Abaixo de 1024px o `pin` do ScrollTrigger
briga com a altura dinâmica da viewport, então cada capítulo revela no lugar.

---

## Dados que faltam antes de publicar

O site traz **avisos visíveis** de conteúdo faltante, em cartão azul com
`data-pendencia`. É deliberado: placeholder invisível vira conteúdo publicado
por esquecimento.

Para achar todos:

    grep -rn "data-pendencia" *.html lojas/*/index.html

O que cada um espera:

| Código | O que falta | Com quem |
|---|---|---|
| `B1` | O critério que separa **18x de 25x** no boleto — as duas condições existem, mas nada diz quando vale cada uma | Eduardo |
| `B2` | Conta de luz: teto de valor e se a conta precisa estar no nome do cliente | vendas |
| `B4` | Crédito CLT: mecânica, financeira, limites | vendas |
| `B5` | Troca do usado: critérios de avaliação | vendas |
| `B6` | Garantia estendida: prazos e coberturas | produtos |
| `B7` | Percentual do desconto no Pix | vendas |
| `B9` | História do CEO Eduardo Hermes | marketing |
| `B12` | Textos jurídicos — **hoje são esqueleto, não documento válido** | advogado |
| `B13` | Dados de contato que faltam | marketing |
| `B16-<cidade>` | Por unidade: CEP, Instagram próprio, telefone fixo | marketing |
| `B8-fotos` | Fotos reais de fachada, equipe e interior das 10 lojas | marketing |
| `FAQPage schema` | As 9 respostas do FAQ — o schema só entra com todas fechadas | marketing |

**Conta de luz não existe em Capão da Canoa e Tramandaí.** As páginas dessas
duas unidades avisam isso, e o dado estruturado delas não lista a modalidade.
Se abrir uma unidade nova, confira isso antes de copiar a página de outra.

---

## O que este site corrige do anterior

| Item | Antes | Agora |
|---|---|---|
| `<h1>` na home | nenhum | 1, único |
| Meta description | ausente em 10 páginas | em todas |
| Imagens sem alt | 70 de 76 | 0 de 129 |
| Scroll horizontal no mobile | 68 elementos | nenhum |
| JSON-LD | nenhum | Organization, WebSite, MobilePhoneStore e BreadcrumbList |
| Open Graph | ausente | completo, com imagem |
| Arquivos CSS | 31 externos | 1 |
| Peso dos banners | 6,7 MB | 1,0 MB (WebP) |
| Chave de API exposta | Google Maps em `/lojas` | nenhuma |
| Páginas por unidade | nenhuma | 10, com conteúdo próprio |
| Páginas de forma de pagamento | nenhuma | 6 |

O que **não** se resolve no código, e depende da hospedagem: HTTPS e os
cabeçalhos de segurança (HSTS, CSP, X-Frame-Options, X-Content-Type-Options).
A página `404.html` também precisa ser apontada no painel — no cPanel, em
**Error Pages**.
