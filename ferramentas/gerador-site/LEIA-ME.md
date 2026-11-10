# Gerador do site

O site publicado continua sendo HTML, CSS e JavaScript puro, sem build no servidor.
Este gerador existe para não manter à mão o cabeçalho, o rodapé e os dados das lojas em 31 páginas.

## Como usar

Precisa de Python 3 e Pillow (`pip install pillow`). Na raiz do repositório:

    python3 ferramentas/gerador-site/gen.py repo

Ele regrava as 31 páginas, `assets/css/hg.css`, `assets/js/hg.js` e a pasta `design-system/` (tokens e página de referência).
Imagem que já existe no repositório nunca é apagada nem regravada; as novas só são criadas se faltarem.
O `<title>`, a descrição, o canonical, o Open Graph e os JSON-LD de cada página são lidos da própria página antes de regravar, então continuam como estão. Para mudar SEO, edite o `<head>` da página e rode o gerador de novo.

Para montar um pacote de pré-visualização (fontes embutidas, imagens reduzidas):

    python3 ferramentas/gerador-site/gen.py artefato /caminho/de/saida

## Onde mexer

| Arquivo | O que tem |
|---|---|
| `dados.py` | Lojas (endereço, horário, WhatsApp, fotos, dados a confirmar), formas de pagamento, marcas, acessórios, FAQ, avaliações e campanhas |
| `base.py` | Cabeçalho, menu, rodapé, títulos em três tons, cartão de pendência e demais peças compartilhadas |
| `paginas.py` | Início, Sobre, CEO, Smartphones, Acessórios, Serviços, Garantia, FAQ, Contato, páginas legais e 404 |
| `paginas2.py` | Como comprar, as seis formas de pagamento, Lojas e as dez unidades |
| `hg.css` | Folha única do site, nos tokens do `DESIGN.md` |
| `hg.js` | Estado (aberta agora, filtros, menu) e movimento (GSAP + ScrollTrigger + Lenis) |
| `sistema.py` | O sistema de design: nota de uso de cada token e a página `design-system/index.html` |

Mudou o horário de uma loja? Edite `dados.py` e rode o gerador: a página da unidade, a página de Lojas, o mapa e o status "aberta agora" saem do mesmo dado.
O JSON-LD de cada loja não sai de `dados.py`; ele é herdado do `<head>` da página e precisa ser conferido à parte.

## O que este gerador não toca

- `sitemap.xml` e `robots.txt` (gerados por `ferramentas/gerar-seo.js`). A página nova `acessorios.html` ainda precisa entrar no sitemap.
- `assets/css/site.css`, `assets/css/hero-cinematic.css` e `assets/js/site.js`, `banner.js`, `motion.js`, `hero-cinematic.js`: eram da versão anterior e não são mais carregados por nenhuma página. Podem ser removidos depois de aprovar o novo site.
