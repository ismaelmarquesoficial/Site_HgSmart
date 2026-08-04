# Plano de aplicação — Novo site HG Smart

Consolidação do `Informação.md` (briefing) + `SEO TECNICO` cruzados com o que já
está construído em `hgsmart-novo/`.

Organizado em quatro partes:

1. **Correções** — onde o briefing contradiz o que eu já fiz
2. **Bloqueios** — o que não dá para executar sem resposta sua
3. **Escopo página por página** — com status de cada item
4. **SEO técnico** — checklist com status

---

## 1. Correções ao que já foi construído

### 1.1 Troop Telecom é do grupo. Eu errei.

O briefing diz, no slide 7: **"Troop Telecom — Operadora do Grupo Hermes"**.

Eu desativei esse banner (`"ativo": false` em `data/banners.json`) argumentando que
era anúncio de terceiro num site institucional. A premissa estava errada — é
empresa irmã, não anunciante. **Precisa ser reativado.**

Ação: `data/banners.json` → banner 7 → `"ativo": true`.

### 1.2 O banner tem 8 slides, e eu só tenho arte para 4

O briefing descreve 8 slides. Cruzando com os 7 JPEGs que baixei do site antigo:

| # | Briefing | Arte que existe |
|---|---|---|
| 1 | iPhones + conta de luz 24x, sem entrada | `banner-1` — confere |
| 2 | Celulares no boleto, aprovação para negativados | `banner-2`, `-4` ou `-5` — servem |
| 3 | Motorola, Samsung, Xiaomi, Realme — 10x sem juros no cartão | `banner-3` tem as marcas, mas a arte **não menciona 10x sem juros** |
| 4 | **Crédito CLT** | **não existe** |
| 5 | **Películas HG Fiber e HG Premium (Hidrogel)** | **não existe** |
| 6 | **Capinhas HG Smart** | **não existe** |
| 7 | Troop Telecom | `banner-7` — confere |
| 8 | **Aporte Financeiro HG Smart** | **não existe** |

**Faltam 4 artes novas** (slides 4, 5, 6, 8) e uma revisão do slide 3. Isso é
trabalho de design, não de código — o slider já está pronto para receber: basta
colocar os arquivos em `assets/img/banners/original/`, rodar `npm run banners` e
adicionar as entradas no JSON.

### 1.3 Os números de parcelamento estão em conflito em três fontes

| Forma de pagamento | Site antigo (Serviços) | Arte do banner | Briefing |
|---|---|---|---|
| Boleto | 25x, entrada 10–30% | **18x** | não especifica |
| Conta de luz | 24x | 24x | 24x, **sem entrada** |
| Cartão | 10x | — | 10x **sem juros** |
| Crédito CLT | — | — | existe, sem número |

O que eu escrevi no site novo veio do site antigo: 25x boleto com entrada de
10% a 30%. O briefing diz "sem entrada" para a conta de luz e "sem juros" para o
cartão — duas informações que eu **não** tenho no site. E o boleto continua sem
resposta: 25x ou 18x?

**Nada disso eu posso decidir.** São condições comerciais.

### 1.4 A foto que usei no hero é provavelmente o CEO

O briefing tem uma seção "Conheça o CEO — história de **Eduardo Hermes**". A foto
que coloquei no hero (`img11.jpg`, o homem de camiseta HG Smart em frente à loja)
é quase certamente ele.

Usar imagem de pessoa identificável num hero é decisão dele, não minha. **Confirme
antes de publicar.**

### 1.5 O briefing pede Google Maps integrado

Eu deliberadamente **não** usei Maps na página de lojas, porque o site antigo
expunha uma chave de API no HTML de `/lojas` e eu não quis repetir isso. Usei link
de rota em vez de mapa embutido.

O briefing pede mapa integrado. Dá para fazer com segurança, mas exige:
- criar uma chave nova no Google Cloud
- **restringir por referrer HTTP** a `hgsmart.com.br/*`
- restringir às APIs de Maps que o site usa
- revogar a chave antiga que está exposta

Sem restrição, qualquer pessoa usa a chave e a cobrança cai na conta de vocês.

### 1.6 O botão de WhatsApp fixo foi removido e o briefing pede de volta

O `SEO TECNICO` pede "botão de WhatsApp fixo em todas as páginas". Não existe hoje.
Precisa decidir **qual número** ele chama — a rede tem 7 lojas com WhatsApps
diferentes. Opções: número da matriz, ou um botão que abre a lista de lojas.

---

## 2. Bloqueios — preciso de resposta para seguir

Estes não têm resposta possível a partir do código ou do site antigo:

| # | Pergunta | Bloqueia |
|---|---|---|
| B1 | Boleto é **18x ou 25x**? Tem entrada ou não? | Home, Serviços, Catálogo, arte do banner 6 |
| B2 | Conta de luz é **sem entrada** mesmo? | Home, Serviços |
| B3 | Cartão é **10x sem juros**? | Home, Serviços, Catálogo |
| B4 | **Crédito CLT**: quantas parcelas, qual regra, qual público? | Nova seção "Como comprar" |
| B5 | **Troca do usado**: como funciona? Avaliação na loja? | Nova seção "Como comprar" |
| B6 | **Garantia estendida**: prazo, cobertura, preço, como contrata? | Nova página |
| B7 | Modelos e preços reais do catálogo | `data/catalogo.json` (hoje é exemplo) |
| B8 | Foto da fachada de **cada uma das 7 lojas** | Página de lojas (o briefing pede foto por loja) |
| B9 | Texto e vídeo institucional do CEO | Nova página |
| B10 | Razão social completa da matriz | Rodapé |
| B11 | E-mail de contato | Contato, rodapé, schema |
| B12 | Política de Privacidade e Termos de Uso — texto jurídico | Duas páginas novas |
| B13 | "Abertura de ticket" — é sistema próprio, Zendesk, ou só e-mail? | Contato |
| B14 | IDs de GA4, GTM e Pixel Meta | SEO técnico |
| B15 | Avaliações de clientes — os 40 prints do site antigo, ou Google Reviews? | Seção de depoimentos + schema de Avaliações |

---

## 3. Escopo página por página

Legenda: **✅ feito** · **🟡 parcial** · **❌ falta**

### 3.1 Home

| Item do briefing | Status | Observação |
|---|---|---|
| Banner com slides automáticos | 🟡 | Slider pronto e funcionando, com 6 de 8 slides. Faltam 4 artes (§1.2) |
| Botão "Encontre a loja mais próxima" | 🟡 | Existe CTA para `lojas.html`. O briefing quer que abra foto + endereço + WhatsApp + horário + "Como chegar" |
| Foto da fachada por loja | ❌ | Só tenho uma foto genérica (B8) |
| Endereço, WhatsApp, horário por loja | ✅ | Vem de `data/lojas.json`, dados reais |
| Botão "Como chegar" | ✅ | Link de rota do Google Maps |

### 3.2 Sobre a HG Smart

| Item | Status | Observação |
|---|---|---|
| História da empresa | ✅ | Seção "Nossa história" na home + página `quem-somos.html` |
| Missão / Visão / Valores | ✅ | Em `quem-somos.html`, texto do site antigo |
| Crescimento da rede | 🟡 | Coberto como "três atos" em `quem-somos.html`. Sem dados de crescimento (nº de lojas por ano, faturamento) |

### 3.3 Conheça o CEO — ❌ página inteira falta

Precisa de: texto sobre Eduardo Hermes, fundação, expansão, e o vídeo
institucional (B9). Vira `ceo.html` ou uma seção dentro de `quem-somos.html`.

### 3.4 Como comprar — ❌ página inteira falta

O briefing pede explicação de 6 caminhos. Hoje `servicos.html` cobre 4 deles
parcialmente:

| Forma | Status |
|---|---|
| À vista | 🟡 mencionado como "Pix com desconto" |
| Cartão de crédito | 🟡 sem o "sem juros" |
| Boleto | 🟡 número em conflito (B1) |
| Conta de luz | 🟡 sem o "sem entrada" (B2) |
| **Crédito CLT** | ❌ não existe (B4) |
| **Troca do usado** | ❌ não existe (B5) |

### 3.5 Produtos

| Categoria do briefing | Status |
|---|---|
| iPhones | ✅ marca Apple em `catalogo.html` |
| Samsung, Xiaomi, Realme, Motorola | ✅ |
| **Smartphones seminovos** | ❌ não é categoria própria hoje |

Modelos e preços seguem sendo estrutura de exemplo (B7).

### 3.6 Acessórios — 🟡 tenho 5 de 13

| Briefing | Status |
|---|---|
| Capinhas, Películas, Carregadores, Cabos, Fones, Caixas de som | ✅ |
| **Películas HG Fiber** (marca própria) | ❌ |
| **Películas HG Premium / Hidrogel** (marca própria) | ❌ |
| **Capinhas HG Smart** (marca própria) | ❌ |
| Power Banks, Alexa, Smartwatches, Suportes, Adaptadores | ❌ |

**Ponto importante que o briefing revela:** HG Fiber, HG Premium e Capinhas HG
Smart são **marca própria**. Isso merece destaque próprio, não uma linha na lista
de acessórios genéricos — é diferencial competitivo.

### 3.7 Garantia estendida — ❌ falta (B6)

### 3.8 Contato — ❌ página inteira falta

WhatsApp, e-mail, formulário, abertura de ticket, redes sociais. Formulário em
site estático precisa de serviço externo (Formspree, Netlify Forms) ou endpoint
próprio — decisão de infraestrutura.

### 3.9 Rodapé

| Item | Status |
|---|---|
| CNPJ da matriz | ✅ 54.988.129/0001-89 |
| Telefones | ✅ os três |
| Endereço da matriz | ✅ Santa Cruz do Sul |
| Redes sociais | ✅ Instagram, Facebook, YouTube, TikTok |
| **Razão social** | ❌ (B10) |
| **Política de Privacidade** | ❌ (B12) |
| **Termos de Uso** | ❌ (B12) |

### 3.10 FAQ — ❌ falta, e é a maior oportunidade de SEO da lista

As 9 perguntas do briefing são exatamente o que as pessoas pesquisam no Google:

1. Como funciona o boleto?
2. Como funciona a conta de luz?
3. Como funciona o Crédito CLT?
4. Posso comprar estando negativado?
5. Quais documentos preciso?
6. Como faço uma simulação?
7. Como encontrar uma loja?
8. Como funciona a garantia?
9. Como funciona a troca do usado?

Com `FAQPage` schema, essas respostas podem aparecer direto no resultado de busca
e em resposta de IA. **A auditoria de GEO deu 0/16 em schema justamente por não
existir FAQ.** Depende das respostas de B1 a B6.

---

## 4. SEO técnico — checklist

| Requisito | Status | O que falta |
|---|---|---|
| Site extremamente rápido | 🟡 | CSS 38KB, JS 133KB, fontes 62KB, 1 CSS só. Falta medir Lighthouse com o site publicado |
| Responsivo para celular | ✅ | Verificado: zero overflow horizontal nas 5 páginas |
| URLs amigáveis | 🟡 | Hoje é `/lojas.html`. "Amigável" seria `/lojas` — precisa de regra no host ou pasta por página |
| Meta Title e Description | ✅ | Nas 5 páginas, únicos |
| **Sitemap XML** | ❌ | Gero automaticamente |
| **Robots.txt** | ❌ | Gero, já liberando os bots de IA |
| Schema: Empresa | ✅ | `Organization` na home |
| Schema: Loja | 🟡 | `MobilePhoneStore` de 1 loja só. Faltam 6 |
| **Schema: Produto** | ❌ | Depende de B7 (preço real) |
| **Schema: FAQ** | ❌ | Depende de §3.10 |
| **Schema: Avaliações** | ❌ | Depende de B15 |
| **Google Analytics 4** | ❌ | Preciso do ID (B14) |
| **Google Search Console** | ❌ | Verificação por meta tag ou DNS |
| **Google Tag Manager** | ❌ | Preciso do container (B14) |
| **Pixel Meta** | ❌ | Preciso do ID (B14) |
| **Google Maps integrado** | ❌ | Ver §1.5 — exige chave restrita |
| **Botão WhatsApp fixo** | ❌ | Ver §1.6 — qual número? |

### Fora do briefing, mas pendente do audit do site atual

Estes são de **servidor**, não de código — precisam ser feitos no host:

- `Strict-Transport-Security` ausente nas 20 páginas
- `X-Frame-Options` / CSP `frame-ancestors` ausente — vulnerável a clickjacking
- `X-Content-Type-Options: nosniff` ausente
- Redirect HTTP→HTTP em 19 páginas internas (deveria ir direto para HTTPS)
- **Chave da Google API exposta** em `/lojas` do site atual — revogar

---

## 5. Ordem sugerida

**Bloco A — não depende de você** (posso fazer agora)

1. Reativar o banner 7 (Troop)
2. `robots.txt` + `sitemap.xml`
3. Schema das 7 lojas (não só uma)
4. Botão de WhatsApp fixo (com o número que você definir em B1.6)
5. Propagar seções claras / cards azuis / tipografia para as outras 4 páginas
6. Estrutura vazia das páginas que faltam: CEO, Como comprar, Garantia, Contato, FAQ, Política, Termos — prontas para receber texto

**Bloco B — depende das respostas B1 a B6** (condições comerciais)

7. Corrigir os números de parcelamento em todas as páginas
8. Página "Como comprar" completa, com Crédito CLT e troca do usado
9. FAQ com as 9 perguntas + `FAQPage` schema
10. Garantia estendida

**Bloco C — depende de material** (fotos, textos, IDs)

11. 4 artes de banner novas
12. Foto da fachada das 7 lojas
13. Página do CEO + vídeo
14. Catálogo com modelos e preços reais
15. GA4, GTM, Pixel, Search Console
16. Marca própria: HG Fiber, HG Premium, Capinhas HG Smart
17. Depoimentos / avaliações
18. Política de Privacidade e Termos de Uso

**Bloco D — no servidor, não no código**

19. Cabeçalhos de segurança
20. Redirect HTTPS
21. Chave do Maps restrita + revogar a antiga
22. URLs sem `.html`
