# ESTRATÉGIA DO NOVO SITE HG SMART – 2026

> **Documento único de acompanhamento.** Une a estratégia, as suas observações e a
> verificação técnica do que existe hoje em `hgsmart-novo/`.
>
> Substitui e absorve: `Informação.md` (briefing), `SEO TECNICO`, `MAPA-DO-SITE.md`,
> `PLANO-DE-APLICACAO.md` e o antigo `CHECKLIST-ESTRATEGIA-2026.md`.
>
> **Código verificado em 2026-08-04.** Onde os documentos antigos divergem do código,
> vale o código.

**Legenda de status**

| | Significado |
|---|---|
| ✅ | Feito e conferido no código |
| 🟡 | Existe, mas incompleto |
| ❌ | Não existe |
| ❓ | Depende de decisão da empresa |
| 💡 | Sugestão minha, não estava na estratégia |

**Suas observações aparecem assim:**
> 🟠 **SUA OBSERVAÇÃO** — texto original preservado.

---

# ⚠️ TRAVAS DE PUBLICAÇÃO — resolver antes de qualquer outra coisa

### 1. Sete páginas mostram caixa azul de "Conteúdo pendente" ao visitante

Não é comentário escondido no código — é aviso **visível na tela**:
`ceo.html` · `contato.html` · `faq.html` · `garantia.html` · `politica-de-privacidade.html` · `politica-de-cookies.html` · `termos-de-uso.html`

Conferir com `grep -rn 'data-pendencia' *.html`.

### 2. O site se contradiz sobre o boleto

| Fonte | Diz |
|---|---|
| Arte do banner 6 | **18x** |
| Home e página de Serviços | **25x** |
| **Sua estratégia, slide 2** | **18x** |

Duas das três fontes dizem 18x. **Confirmar e alinhar tudo.**

### 3. Zero rastreamento instalado

Sem GA4, GTM e Pixel, nenhum dos 12 indicadores da seção 17 existe.

---

## 1. Objetivo principal

Transformar o site da HG Smart em uma ferramenta para:

| Objetivo | Status | Situação hoje |
|---|---|---|
| Apresentar as formas de pagamento | 🟡 | As 6 formas existem, mas numa página só (`como-comprar.html`) |
| Facilitar a compra de smartphones | 🟡 | Site é institucional: mostra marcas, sem preço nem carrinho (decisão de 2026-07-28) |
| Direcionar clientes para lojas e WhatsApps | ✅ | WhatsApp por unidade + botão fixo nas 13 páginas |
| Fortalecer a credibilidade da rede | ✅ | História, CEO, 20 avaliações reais do Google |
| Aparecer no Google em cada cidade | ❌ | **Falta a peça central: página por unidade** |
| Medir contatos e oportunidades | ❌ | **Nada instalado** |

> 🟠 **SUA OBSERVAÇÃO** — *"PERGUNTAR: cada forma de pagamento vai ir para uma aba explicativa como a forma funciona?"*
>
> **Resposta:** a sua própria estratégia já decide isso na seção 6 — são **6 páginas próprias**
> (conta de luz, boleto, CLT, cartão, Pix, troca do usado), cada uma explicando como funciona,
> quem pode, documentos, se tem entrada e onde simular.
> **Hoje existe 1 página com as 6 formas resumidas.** Faltam as 6 páginas individuais.

> 🟠 **SUA OBSERVAÇÃO** — *"ADICIONAR O BOTÃO DO WHATS AO LADO DO NÚMERO DE CADA LOJA"*
>
> **Verificado — você tem razão.** Os números **já são links** para `wa.me`, mas aparecem
> como texto azul comum, sem ícone e sem cara de botão. Quem olha não percebe que clica.
> ✅ **FEITO em 2026-08-04.** Cada número virou um chip clicável com o ícone do WhatsApp e
> alvo de toque de 44px (WCAG 2.5.8). Ficou no **azul da marca**, não no verde do WhatsApp:
> a paleta tem três cores por decisão de projeto e o ícone já entrega o reconhecimento.
> Se preferir o verde, é uma linha no `.chip-zap` do `src.css`.

> 🟠 **SUA OBSERVAÇÃO** — *"VER O QUE A IA PODE FAZER PARA AJUDAR ISSO (sub página para cada cidade)"*
>
> **Onde a IA ajuda com segurança:** montar a estrutura das 10 páginas, gerar títulos e
> descrições únicos por cidade, escrever o schema `LocalBusiness`, montar o FAQ por unidade
> a partir das perguntas gerais, e sugerir os pontos de referência a partir do endereço.
>
> **Onde ela NÃO pode agir sozinha:** o texto local precisa ser **verdadeiro**. Se a IA
> inventar ponto de referência, vizinhança ou serviço, cria exatamente a página de baixo
> valor que a sua seção 10 alerta contra — e o Google trata isso como conteúdo enganoso.
>
> 💡 **Fluxo recomendado:** IA monta 90% + gerente de cada loja revisa e confirma os fatos locais.
> É a diferença entre 10 páginas que ranqueiam e 10 páginas que atrapalham o domínio inteiro.

> 🟠 **SUA OBSERVAÇÃO** — *"CRIAR EVENTOS PARA O GTM: jornada de contato, jornada de lead,
> desde visualizou a página, qual página visualizou, scroll de 0 a 100%, formulário, click em
> botões mapeando todos e classificando, vídeo, compra, engajamento"*
>
> **Ótima lista — virou especificação técnica.** Ver a seção **17-A** no fim deste documento.

> 🟠 **SUA OBSERVAÇÃO** — *"REVISAR A VERSÃO MOBILE"*
>
> **Status:** ✅ o site não tem estouro horizontal e é responsivo de verdade.
> 🟡 Mas achei 3 problemas específicos de mobile:
> 1. **Arte do slide 1 no mobile** corta a conta de luz para o canto — o elemento visual some
> 2. **Seção pinada está desligada** abaixo de 1024px (o pin briga com a barra de endereço do navegador) — é decisão técnica consciente, mas o mobile perde o efeito
> 3. **Números de WhatsApp** como texto, não botão — pior ainda no toque, onde alvo pequeno erra

---

## 2. Página inicial — **responsável: ISMAEL**

> 🟠 **SUA OBSERVAÇÃO** — *"IMAGENS DELE COM FOTOS"*
>
> ⚠️ Atenção relacionada: a foto usada hoje no **hero** (`img11.jpg`, homem de camiseta HG Smart
> em frente à loja) é quase certamente o Eduardo Hermes. Usar imagem de pessoa identificável
> na abertura do site precisa de autorização dele. **Confirmar antes de publicar.**

### Situação do slider: 7 artes no ar, mas 5 dizem a mesma coisa

| Arte | Tema real |
|---|---|
| banner-1 | conta de luz |
| banner-2 a banner-6 | **cinco variações de Android no boleto** |
| banner-7 | Troop Telecom |

**Dos 9 slides da estratégia, o slider cobre 3 temas.**

### Slide a slide

| # | Slide | Status | O que falta |
|---|---|---|---|
| 1 | **Conta de luz** | 🟡 | ver auditoria abaixo |
| 2 | **Boleto** | 🟡 | arte existe; falta **listar os documentos necessários**; número em conflito |
| 3 | **Androids** | 🟡 | as marcas aparecem; falta **"até 10x sem juros no cartão"** |
| 4 | **Crédito CLT** | ❌ | arte não existe |
| 5 | **Películas HG Fiber / HG Premium** | ❌ | arte não existe |
| 6 | **Capinhas HG Smart** | ❌ | arte não existe |
| 7 | **Acessórios** | ❌ | arte não existe |
| 8 | **Troop Telecom** | ✅ | arte no ar |
| 9 | **Aporte financeiro** | ❌ | arte não existe — **exige validação jurídica antes** |

- ✅ Slides leves, sem prejudicar a velocidade — WebP + JPEG em 3 tamanhos, sem CDN, altura travada
- ❌ **Botão próprio por slide** — hoje nenhum slide tem botão de verdade
- 💡 Reduzir as 5 artes de boleto para 1 ou 2 e liberar espaço para os temas que faltam

### AUDITORIA DO SLIDE 1 — pedido × o que está no ar

Conferido abrindo as artes `banner-1-desktop.jpg` e `banner-1-mobile.jpg`.
A arte diz apenas: **"iPhones com parcelamento na conta de luz"** + botão pintado **"OFERTAS DISPONÍVEIS →"**.

| Você pediu | Status | Situação |
|---|---|---|
| iPhones novos e seminovos | 🟡 | diz "iPhones", **não diz "novos e seminovos"** |
| Conta de luz em até **24x** | 🟡 | diz "conta de luz", **não diz 24x**. O "24x" só aparece na seção 6 da home, longe do slide |
| **Sem entrada** | ❌ | **não aparece em lugar nenhum da home** |
| Fácil aprovação para negativados | ❌ | "negativado" aparece 1× na home, no card do **boleto**, não da conta de luz |
| Conta de luz branca com traço vermelho | ✅ / ⚠️ | existe no desktop; **no mobile fica cortada no canto, quase invisível** |
| Botão "Simule na loja mais próxima" | ❌ | diz **"OFERTAS DISPONÍVEIS"** e leva a Serviços, **não ao localizador** |

**Dos 5 argumentos de venda, a arte comunica 1.** E o botão não é botão: está pintado dentro
da imagem — o que é clicável é o banner inteiro.

**💡 SOLUÇÃO PRONTA PARA APLICAR** — texto HTML numa faixa abaixo da arte, em vez de refazer o JPEG:

- **Argumentos:** iPhones novos e seminovos · Até 24x na conta de luz · Sem entrada · Aprovação facilitada para negativados
- **Botão real:** "Simule na loja mais próxima" → página de lojas
- **Letra miúda:** Condições sujeitas a análise. Disponível nas cidades atendidas pela RGE.

Por que HTML e não arte nova: o Google indexa, o leitor de tela lê, e trocar "24x" vira
edição de arquivo em vez de contratar designer.

> ⛔ **Travado:** "sem entrada" nunca foi confirmado pela rede. Não publico condição comercial
> não verificada. Confirme e aplico.

---

## 3. Botão principal — ENCONTRE A LOJA MAIS PRÓXIMA DE VOCÊ

| Item | Status | Situação |
|---|---|---|
| Botão abaixo dos slides | 🟡 | existe e leva à lista de lojas |
| Pesquisar por cidade | ❌ | **não existe campo de busca** |
| Permitir a localização | ❌ | **geolocalização não implementada** |

### O que cada unidade deve apresentar

| Dado | Status | Observação |
|---|---|---|
| Nome da unidade | ✅ | 11 entradas: 10 operando + Pelotas "em breve" |
| Endereço completo | 🟡 | **Farroupilha sem número** · **Cachoeira do Sul com endereço divergente** · **5 das 10 sem CEP** |
| Horários | ✅ | semana, sábado e **domingo** (Cachoeirinha e Capão da Canoa) |
| WhatsApp próprio | ✅ | 22 números em chips de 44px, no índice e na página de cada unidade |
| Botão "Como chegar" | ✅ | link de rota do Google Maps |
| Foto da fachada | ❌ | **não existe foto por unidade** |
| Instagram | ❌ | só o perfil geral `@redehgsmart` |
| Telefone | ❌ | campo não existe no cadastro |
| Mapa do Google | 🟡 | link de rota, **sem mapa embutido** — foi decisão de segurança, ver seção 14 |
| Formas de pagamento da unidade | ❌ | campo não existe |
| Avaliações dos clientes | ❌ | as 20 avaliações são gerais, não por loja |

**Pendências de dados** — cada uma vira cartão azul visível na página da unidade, com o
código `B16-<cidade>`:

| Loja | Falta | Código |
|---|---|---|
| Cachoeira do Sul | coordenada · CEP · **endereço divergente** (confirmar se mudou de endereço ou se são duas lojas) | `B16-cachoeira-do-sul` |
| Santa Maria | coordenada · CEP | `B16-santa-maria` |
| Farroupilha | coordenada · CEP · **endereço sem número** | `B16-farroupilha` |
| Bento Gonçalves | coordenada · CEP | `B16-bento-goncalves` |
| Cachoeirinha | CEP | `B16-cachoeirinha` |
| todas as 10 | foto real da fachada | `B8-fotos` |

> **B16 é código novo, criado nesta etapa** = dado cadastral da unidade faltando
> (coordenada, CEP, endereço a confirmar). Não confundir com **B8**, que no
> `PLANO-DE-APLICACAO.md` já significa **foto da fachada** — são coisas diferentes e por
> isso têm códigos diferentes.

⚠️ **Correção a este checklist:** a versão anterior registrava só as 4 lojas sem coordenada.
Auditando `data/lojas.json`, são **6 sem CEP** — as 5 da tabela acima mais Pelotas, que não
gera página. Sem o dado, `postalCode` e `geo` **saem** do JSON-LD em vez de ir vazios ou
aproximados.

**Ainda em aberto:** WhatsApp de Santa Cruz precisa ser testado (veio com 12 dígitos,
corrigido para 13).

✅ **RESOLVIDO em 2026-08-06 — domingo.** O dono confirmou: **Cachoeirinha (09:30–18:30) e
Capão da Canoa (13:00–19:00) abrem no domingo.** A lista oficial de 2026-07-27 estava
incompleta neste ponto — ela não menciona domingo em unidade nenhuma, e disso tinha sido
concluído, errado, que nenhuma abria. O `faq.html` e o `README.md` sempre disseram a coisa
certa; quem estava incompleto era o JSON. Campo `horarios.domingo` acrescentado às duas
unidades, selo "Abre no domingo" no cartão, e `OpeningHoursSpecification` de `Sunday` no
JSON-LD das duas.

---

## 4. Seções da página inicial

| Ordem pedida | Status | Onde está hoje |
|---|---|---|
| 1. Slides | 🟡 | é a **5ª** seção, não a 1ª |
| 2. Botão encontrar a loja | 🟡 | existe, sem busca nem geolocalização |
| 3. Formas de pagamento | ✅ | seção 6 da home |
| 4. Categorias de smartphones | 🟡 | é lista de **marcas**, não categorias. Falta "seminovos" como categoria |
| 5. Acessórios | ❌ | **sem bloco na home** |
| 6. Películas e capinhas | ❌ | **sem bloco na home** |
| 7. Garantia estendida | ❌ | página existe, **sem bloco na home** |
| 8. Avaliações de clientes | ✅ | **CORRIGIDO:** a home TEM a esteira "Quem já comprou" com as 20 avaliações |
| 9. História da HG Smart | ✅ | é a **2ª** seção |
| 10. História do CEO | ❌ | página existe, **sem bloco na home** |
| 11. Perguntas frequentes | ❌ | página existe, **sem bloco na home** |
| 12. Contatos e rodapé | ✅ | rodapé completo |

### Ordem real da home hoje — 11 seções

`① Hero` → `② Nossa história` → `③ Marquee de marcas` → `④ A rede hoje (contadores)` →
`⑤ Slider` → `⑥ Formas de pagamento` → `⑦ O que as lojas têm` → `⑧ Nosso foco` →
`⑨ Depoimentos` → `⑩ Onde nos encontrar` → `⑪ Chamada final`

> **CORRIGIDO em 2026-08-04.** O `MAPA-DO-SITE.md` diz 9 seções: está desatualizado, foi
> escrito antes de a esteira de depoimentos e a seção "Nosso foco" entrarem.

❌ **A home precisa ser reordenada** e ganhar 5 blocos novos.

---

## 5. Menu principal

| Pedido | Status |
|---|---|
| Início | ✅ |
| Smartphones | 🟡 chama-se "Catálogo" |
| Formas de pagamento | ❌ fora do menu |
| Acessórios | ❌ fora do menu |
| Nossas lojas | ✅ chama-se "Lojas" |
| Garantia estendida | ❌ fora do menu |
| Sobre a HG Smart | 🟡 chama-se "A rede" |
| Contato | ❌ fora do menu |
| Perguntas frequentes | ❌ fora do menu |

**Menu atual — 5 itens:** `Início · A rede · Catálogo · Serviços · Lojas`

**Problemas encontrados:**
- **8 páginas não estão em menu nenhum** — só se chega por link interno
- ✅ **RESOLVIDO em 2026-08-04** — `politica-de-cookies.html` era órfã (estava no sitemap, sem link em nenhuma das 12 outras páginas). Entrou na faixa legal do rodapé das **13 páginas**
- ✅ **RESOLVIDO em 2026-08-04** — o menu chamava "A rede" e o rodapé "Quem Somos". Unificado em **"Quem Somos"** (combina com a URL `/quem-somos`) nos 26 links de navegação e no gerador de páginas. ⚠️ O `<title>` da página ainda diz "A rede" — trocar quando o menu for reestruturado
- 💡 **Dívida técnica:** 8 páginas têm o menu gerado por script e 5 têm o menu escrito à mão. Mudar um item hoje exige editar nos dois lugares — **unificar antes de mexer no menu**, senão o trabalho dobra

---

## 6. Formas de pagamento — páginas próprias

**Hoje: 1 página** (`como-comprar.html`) com as 6 formas resumidas. **Pedido: 6 páginas.**

| Página | Status |
|---|---|
| Celular na conta de luz | ❌ |
| Celular no boleto | ❌ |
| Crédito CLT | ❌ |
| Cartão de crédito | ❌ |
| Pix ou dinheiro | ❌ |
| Troca do celular usado | ❌ |

Cada uma precisa de: como funciona · quem pode solicitar · **quais documentos levar** ·
se precisa de entrada · onde simular · condições sujeitas à análise · botão para a loja.

❓ **Bloqueado por decisões comerciais:** Crédito CLT (parcelas, regra, público) e troca do usado
(como funciona a avaliação) não existem em documento nenhum. Sem isso, 2 das 6 páginas não podem ser escritas.

---

## 7. Garantia estendida

| Item | Status |
|---|---|
| Página existe | ✅ `garantia.html` |
| O que é / benefícios / quando contratar / como contratar / coberturas | ❌ **página é esqueleto com aviso de pendência visível** |
| Bloco na home | ❌ |

❓ Depende de: prazo, cobertura, preço e como contrata.

---

## 8. Sobre a empresa

| Item | Status |
|---|---|
| História da HG Smart | ✅ `quem-somos.html` + bloco na home |
| Missão e valores | ✅ |
| Número de lojas | ✅ contado do JSON, não escrito à mão |
| Crescimento da rede | 🟡 narrativo, sem números por ano |
| Cidades atendidas / clientes atendidos | ❌ números oficiais não existem |
| **Fotos reais das lojas, equipe e operação** | ❌ |
| Apresentação do CEO Eduardo Hermes | 🟡 página existe, **é esqueleto** — falta texto e vídeo |

---

## 9. Contato e atendimento

| Item | Status |
|---|---|
| WhatsApp | ✅ |
| E-mail | ✅ |
| Abertura de ticket | ❌ ❓ sistema próprio, Zendesk ou só e-mail? |
| Contato da matriz | ✅ |
| Seleção da unidade desejada | ❌ |
| Assunto do atendimento | ❌ |
| Formulário curto e fácil | ❌ ❓ **para onde os envios vão?** (e-mail, CRM, planilha) |

**Rodapé**

| Item | Status |
|---|---|
| Razão social · CNPJ · Endereço da matriz · E-mail · Telefone · Redes sociais | ✅ CNPJ 54.988.129/0001-89 |
| Política de Privacidade · Termos de Uso · Política de cookies | 🟡 **as 3 páginas são esqueleto — falta redação jurídica** |

---

# ESTRATÉGIA DE SEO LOCAL

## 10. Uma página para cada unidade — ✅ AS 10 EXISTEM

O sitemap passou de 13 para **23 URLs**. As dez unidades têm página própria, `<title>` e
`<h1>` únicos com a cidade, e `MobilePhoneStore` apontando para a própria URL.

| URL | Status |
|---|---|
| `/lojas/santa-cruz-do-sul/` (matriz) · `/lojas/lajeado/` · `/lojas/cachoeira-do-sul/` · `/lojas/capao-da-canoa/` · `/lojas/caxias-do-sul/` · `/lojas/cachoeirinha/` · `/lojas/tramandai/` · `/lojas/santa-maria/` · `/lojas/farroupilha/` · `/lojas/bento-goncalves/` | ✅ geradas por `npm run lojas` |
| `/lojas/pelotas/` | ⏸️ **só quando abrir** — página de loja fechada gera avaliação ruim e não tem Perfil no Google |

O que cada página entrega hoje, e o que ainda falta:

| Item pedido | Status | Situação |
|---|---|---|
| Endereço completo | ✅ | de `data/lojas.json` |
| Horários | ✅ | semana, sábado e domingo onde houver |
| WhatsApp | ✅ | chips de 44px, um por número da unidade |
| Como chegar | ✅ | rota do Google Maps, sem chave de API |
| Formas de pagamento | 🟡 | **só link** para `como-comprar.html`, sem número — trava no B1 (18x × 25x) |
| Mapa embutido | ❌ | decisão de segurança, ver seção 14 |
| **Fotos reais** | ❌ | `B8-fotos` nas 10 páginas |
| **Pontos de referência** | ❌ | não existe no cadastro — **não pode ser inventado**, ver seção 1 |
| Avaliações por unidade | ❌ | as 20 são gerais |
| FAQ da unidade | ❌ | depende de B1/B2/B4/B5/B6 |

⚠️ **Correção a este checklist:** a versão anterior dizia que
`ferramentas/gerar-paginas.js` "monta o esqueleto das 10". **Era falso** — o array `PAGINAS`
daquele arquivo tinha 8 entradas, todas institucionais, e nenhum gerador de unidade existia.
Quem gera as unidades é `ferramentas/gerar-lojas.js`, escrito nesta etapa.

❌ O que **não** dá para automatizar continua sendo o texto local verdadeiro — ver a resposta
sobre IA na seção 1. Por isso nenhuma página traz ponto de referência, vizinhança ou tempo
de deslocamento: o dado não existe, e inventá-lo é o risco de domínio descrito na seção 1.

---

## 11. Pesquisas que queremos conquistar

| Item | Status |
|---|---|
| Mapear cada expressão para a página que vai respondê-la | 🟡 as expressões por cidade já têm página; falta o mapa expressão → página escrito |
| Título e descrição únicos com a cidade | ✅ 10 títulos e 10 descrições, montados a partir do JSON |
| Sem repetição exagerada de palavra-chave | ✅ o site continua sem forçar palavra-chave |

💡 "celular no boleto em Lajeado" já tem onde cair: `/lojas/lajeado/`. Mas a página responde
o **lado da loja** (endereço, horário, WhatsApp), não o lado do boleto — o número de parcelas
segue travado no B1, e enquanto ele não fechar a unidade só pode linkar `como-comprar.html`.

---

## 12. Google Perfil da Empresa — fora do site

Para cada uma das **10 unidades em operação**:

| Item | Status |
|---|---|
| Nome · endereço · horários · telefone · WhatsApp | ❓ conferir unidade por unidade |
| **Site apontando para a página daquela unidade** | ❌ depende da seção 10 |
| Fotos novas · produtos · publicações · avaliações respondidas | ❓ |

---

## 13. Conteúdo para o Google — 2 a 4 por mês

| Item | Status |
|---|---|
| Estrutura de blog no site | ❌ **não existe** |
| As 9 pautas | ❌ nenhuma publicada |

✅ **Bom ponto de partida:** as 9 perguntas do `faq.html` já cobrem a maioria das pautas —
servem de base para os primeiros textos.

---

## 14. Requisitos técnicos

| Requisito | Status | Situação |
|---|---|---|
| Site rápido | ✅ | Sem CDN, fontes e GSAP locais, ~5 MB publicáveis |
| Responsivo | ✅ | Zero estouro horizontal (ver ressalvas de mobile na seção 1) |
| Imagens otimizadas | ✅ | WebP + JPEG, 3 tamanhos, `<picture>` por breakpoint |
| URLs curtas e descritivas | 🟡 | `/lojas/` e `/lojas/<cidade>/` já são pasta com `index.html`, sem depender do host. As outras 12 seguem `.html` |
| Título e descrição exclusivos | ✅ | 23 páginas, todas com canonical |
| **Sitemap XML** | ✅ | **23 URLs** — 13 institucionais + 10 unidades |
| Configuração de indexação | ✅ | `robots.txt` gerado, libera bots de citação de IA |
| Links internos produto ↔ pagamento ↔ loja | 🟡 | loja: rodapé de todas as 23 páginas linka as 10 unidades em HTML estático, e cada cartão do índice/home linka a sua. Falta o eixo produto ↔ pagamento |
| **Google Search Console** | ❌ | |
| **Google Analytics 4** | ❌ | |
| **Google Tag Manager** | ❌ | |
| **Pixel da Meta** | ❌ | |
| **`LocalBusiness` por loja** | ✅ | 10 × `MobilePhoneStore` com endereço, horário e geo |
| Dados estruturados de produto | ❌ | site não lista preço, por decisão da empresa |
| **HTTPS** | ❌ | depende da hospedagem |
| LCP · INP · CLS monitorados | ❌ | depende do GA4 / Search Console |

### 💡 Dois schemas que faltam e valem muito

| Schema | Situação |
|---|---|
| **`Review` + `AggregateRating`** | ⛔ **NÃO fazer com as avaliações atuais.** Corrigi minha recomendação anterior: as 20 avaliações vieram do Google Meu Negócio, e a política de review snippet do Google não aceita avaliação coletada em outro site marcada como sua — o risco é ação manual, não estrela. O caminho certo é coletar avaliação própria no site, que é projeto à parte |
| **`FAQPage`** | ❌ não implementado. A auditoria de GEO deu **0/16 em schema** por causa disso. Habilita resposta direta no Google e citação por IA. A página avisa que o schema só entra com as respostas fechadas — marcação com resposta vazia é penalizada |

### 💡 Servidor — não é código, é hospedagem

- ❌ HTTPS com redirect HTTP → HTTPS (o site atual redireciona HTTP para HTTP)
- ❌ `Strict-Transport-Security` — ausente nas 20 páginas do site atual
- ❌ `X-Frame-Options` / CSP `frame-ancestors` — hoje vulnerável a clickjacking
- ❌ `X-Content-Type-Options: nosniff`
- ❌ URLs sem `.html`
- 🔴 **Revogar a chave da Google Maps API exposta no `/lojas` do site atual**

> **Sobre o "Mapa do Google" pedido na seção 3:** o site novo usa link de rota em vez de mapa
> embutido **de propósito** — o site antigo expunha uma chave de API no HTML. Dá para colocar
> mapa embutido com segurança, mas exige chave nova **restrita por referrer** a `hgsmart.com.br/*`
> e limitada às APIs usadas. Sem restrição, qualquer um usa a chave e a cobrança cai na conta da rede.

---

# RESPONSABILIDADES

## 15. Equipe de marketing

| Entrega | Status |
|---|---|
| Textos dos 9 slides | ❌ |
| **Artes dos 5 slides faltantes** (CLT, películas, capinhas, acessórios, aporte) | ❌ |
| Arte **mobile** do slide 1 refeita | ❌ |
| **Fotos reais das 10 fachadas** | ❌ item mais repetido em toda a documentação |
| Fotos de equipe e operação | ❌ |
| Endereços, horários e WhatsApps | ✅ entregues — faltam 4 coordenadas e o número de Farroupilha |
| Telefone e Instagram por unidade | ❌ |
| Formas de pagamento por unidade | ❌ |
| **Documentos exigidos em cada forma de pagamento** | ❌ |
| História da HG Smart | ✅ |
| Texto e vídeo do CEO | ❌ |
| Números oficiais (cidades, clientes atendidos) | ❌ |
| Lista de produtos e acessórios | 🟡 5 de 13 categorias |
| Perguntas frequentes | ✅ 9 escritas — faltam as respostas fechadas |
| **Texto local exclusivo de cada página de loja** | ❌ |
| Conteúdos mensais | ❌ |
| Conferência dos 10 Perfis no Google | ❌ |

## 16. Desenvolvedor

| Entrega | Status |
|---|---|
| Layout e navegação | ✅ |
| Versão para celular | ✅ com 3 ressalvas (seção 1) |
| Velocidade | ✅ |
| **Páginas individuais das lojas** | ❌ |
| **Localizador com busca e geolocalização** | ❌ |
| **Botão de WhatsApp visível por número** | ✅ **feito** — sua observação |
| Formulários | ❌ |
| **GTM / GA4 / Pixel + eventos** | ❌ |
| Schema de Avaliações e FAQ | ❌ |
| SEO técnico | ✅ base pronta |
| Reordenar a home / reestruturar o menu | ❌ |
| Unificar o cabeçalho das 13 páginas | ❌ dívida técnica |
| Resolver a página órfã de cookies | ✅ **feito** |
| **Versionamento (Git)** | 🟡 repositório criado, commit inicial feito, remote configurado — **falta o `git push`**, que precisa ser rodado por você (este ambiente não abre janela de login) |
| Segurança e manutenção | 🟡 depende do servidor |
| **Painel simples para o marketing** | ❌ hoje a edição é em `data/*.json` — funciona para quem mexe em código, mas não é painel. 💡 Avaliar CMS leve (Decap) ou fluxo marketing → dev |

---

# INDICADORES

## 17. O que deverá ser medido

**Nenhum mensurável hoje.** Todos dependem do GTM/GA4.

Visitas do Google · visitas por cidade · **cliques no WhatsApp** · **cliques em "Como chegar"** ·
ligações · simulações solicitadas · formulários enviados · tickets abertos · páginas mais
acessadas · pesquisas que trazem clientes · posição nas buscas locais · conversões por unidade

---

## 17-A. 💡 PLANO DE EVENTOS DO GTM

> Especificação técnica montada a partir da **sua observação** na seção 1.

### Jornada de visualização
- `page_view` — com **cidade da loja** e **tipo de página** (home, loja, forma de pagamento, FAQ)
- `scroll_depth` — disparos em **25% · 50% · 75% · 100%**
- `time_on_page` — engajamento acima de 30s

### Jornada de contato — os que mais importam
- `click_whatsapp` — com **unidade**, **número** e **origem** (card da home, página da loja, botão fixo)
- `click_como_chegar` — com unidade
- `click_telefone` — com unidade
- `click_instagram` — com unidade

### Jornada de lead
- `form_start` — começou a preencher
- `form_submit` — enviou
- `form_error` — erro de validação (mostra onde o formulário trava)
- `simulacao_solicitada` — **a conversão principal do negócio**
- `ticket_aberto`

### Mapeamento e classificação de botões
- `click_botao` com: **texto do botão · seção da página · destino · tipo**
- Tipos sugeridos: `conversao` (WhatsApp, simulação, formulário) · `navegacao` (menu, links) · `informacao` (saiba mais, FAQ)

> 💡 Para isso funcionar sem retrabalho, cada botão do site precisa de um atributo de
> rastreamento no HTML — melhor decidir o padrão **antes** de criar as 10 páginas de loja
> e as 6 de pagamento, senão vira remendo depois.

### Outros
- `video_start` · `video_progress` (25/50/75%) · `video_complete` — para o vídeo do CEO
- `view_banner` e `click_banner` — **qual slide converte mais** (resolve a dúvida das 5 artes repetidas com dado, não com opinião)
- `engajamento` — visitante que rolou 50% **e** ficou 30s **e** clicou em algo

### Conversões a marcar no GA4
`click_whatsapp` · `simulacao_solicitada` · `form_submit` · `ticket_aberto` · `click_como_chegar`

> ⚠️ **LGPD:** o consentimento de cookies precisa disparar **antes** das tags. Hoje o site tem
> página de política de cookies (órfã), mas **não tem banner de consentimento**.

---

# PLANO DE EXECUÇÃO — onde estamos

## Etapa 1 — Organização 🟡

| Item | Status |
|---|---|
| Confirmar menu e páginas | ❌ |
| Reunir dados de todas as lojas | 🟡 com 5 pendências |
| Separar fotos e materiais | ❌ |
| Aprovar textos dos slides | ❌ |

## Etapa 2 — Desenvolvimento 🟡

| Item | Status |
|---|---|
| Criar a página inicial | ✅ pronta, mas precisa reordenar |
| Criar o localizador de lojas | 🟡 lista as lojas, **não localiza** |
| Criar as páginas das unidades | ✅ as 10, geradas por `npm run lojas` (Pelotas fica de fora até abrir) |
| Criar páginas das formas de pagamento | ❌ |
| Implementar contatos e formulários | ❌ |

## Etapa 3 — SEO e mensuração 🔴

| Item | Status |
|---|---|
| Títulos, descrições e URLs | ✅ |
| Dados estruturados | 🟡 loja e empresa ✅ · **FAQ e avaliações ❌** |
| Analytics, Search Console, Tag Manager | ❌ |
| Eventos e conversões | ❌ ver 17-A |

## Etapa 4 — Lançamento 🔴

Não iniciado. Hospedagem e domínio indefinidos. **7 páginas ainda com aviso de pendência visível.**

---

# ANEXO — O QUE JÁ EXISTE NO FRONT

Levantamento do que está construído. Serve para **não refazer o que já está pronto**.

## Animações — camada em GSAP + ScrollTrigger + Lenis (136 KB, tudo local)

| Efeito | Onde |
|---|---|
| Rolagem suave (Lenis) integrada ao ScrollTrigger | site todo |
| Barra de progresso de leitura | topo |
| Hero entra linha por linha, com máscara | home |
| Revelação ao rolar em 3 modos: elemento · grupo escalonado · linha a linha | todas as seções |
| Marquee de marcas que **inverte conforme o sentido do scroll** | home ③ |
| 4 contadores animados | home ④ |
| Ken Burns lento na arte do slide ativo | slider |
| Brilho que segue o cursor nos cartões | cards |
| Seção pinada | **só desktop** — abaixo de 1024px o pin briga com a barra de endereço |

✅ Com `prefers-reduced-motion: reduce`, nada disso roda, o slider não avança sozinho
(WCAG 2.2.2) e os contadores mostram o valor final direto.

### 💡 Sugestões de animação — e um cuidado

- Entrada dos argumentos do banner por máscara, acompanhando a troca de slide
- Transição suave da lista para o card da unidade ao filtrar por cidade
- Contadores nas páginas de unidade (componente já existe)
- Estado de carregamento nos cards de loja — hoje aparece "Carregando os banners…" em texto puro
- Reavaliar a seção pinada no mobile

> ⚠️ **Cuidado deliberado:** a estratégia diz que os slides não podem prejudicar a velocidade,
> e a camada de movimento já custa 136 KB. **Sugestão: não adicionar biblioteca nova** — o que
> faltar, fazer com o GSAP que já está no projeto.

## Sistema visual

**Paleta — 3 cores tiradas da identidade real** (o azul saiu dos pixels do logo):
`preto #000000` · `preto-alto #06080b` · `branco` · `prata #a7b2bc` · `cinza #737e88` ·
`azul #00a2c7` · `azul-escuro #00506b`

**Tipografia:** Bebas Neue (títulos) + Inter variável (corpo) — auto-hospedadas, nenhuma
requisição a `fonts.googleapis.com`

**Elementos recorrentes:** halos azuis nos cantos · números fantasma 01–05 · granulado de
filme · contorno tipográfico vazado · filete rotulado · seção clara que inverte os tokens de tinta

## Acessibilidade e qualidade — já resolvido, não mexer

- ✅ Contraste WCAG AA medido — o botão azul usa **tinta preta**: branco sobre `#00A2C7` daria 3,0:1 e reprovaria
- ✅ Nada depende de JavaScript para ser lido — se o GSAP falhar, o conteúdo aparece inteiro
- ✅ Slider pausa no hover, no foco do teclado e com a aba em segundo plano
- ✅ Navegação por teclado e arraste no toque
- ✅ Depoimentos transcritos como **texto**, não como print — leitor de tela lê e o Google indexa
- ✅ Zero requisição externa — sem CDN no caminho crítico
- ✅ Sem chave de API exposta

## Arquitetura

- ✅ HTML estático + Tailwind + JS vanilla — sem WordPress, sem banco, sem PHP
- ✅ Sobe em qualquer host estático (~5 MB publicáveis)
- ✅ Conteúdo que muda com frequência isolado em `data/*.json`
- ✅ 8 ferramentas de geração (`npm run seo`, `paginas`, `banners`, `mapa`, `rodape`, `zap`)
- ✅ Rodapé unificado nas 13 páginas por script
- 🟡 **Cabeçalho ainda NÃO unificado** — 8 páginas geradas + 5 à mão

---

# ❓ DECISÕES QUE TRAVAM O RESTO

Nada disso se resolve no código.

| Pergunta | Trava |
|---|---|
| Boleto é **18x ou 25x**? Com ou sem entrada? | Home, Serviços, arte do banner 6 |
| Conta de luz é **sem entrada** mesmo? | Slide 1, Home, Serviços |
| Cartão é **10x sem juros**? | Home, Serviços |
| Crédito CLT: parcelas, regra, público? | Slide 4 + página de pagamento |
| Troca do usado: como funciona a avaliação? | Página de pagamento |
| Garantia estendida: prazo, cobertura, preço? | `garantia.html` |
| Abertura de ticket: sistema próprio, Zendesk ou e-mail? | `contato.html` |
| Para onde vão os formulários? | `contato.html` |
| **IDs de GA4, GTM e Pixel** | Toda a mensuração |
| **Hospedagem e domínio de produção** | HTTPS, Search Console, publicação |
| Aporte financeiro liberado pelo jurídico? | Slide 9 |
| A foto do hero é o Eduardo Hermes? Ele autoriza? | Home |
| Texto jurídico de Privacidade, Termos e Cookies | 3 páginas |
| Farroupilha sem número · Cachoeira do Sul mudou de endereço ou são 2 lojas? | Dados das lojas |

---

# DIREÇÃO FINAL — o site responde hoje?

| Pergunta | Responde? |
|---|---|
| **Como posso comprar meu celular?** | 🟡 sim, numa página só, sem documentos por forma |
| **Quais formas de pagamento estão disponíveis?** | 🟡 sim, sem página própria por forma |
| **Onde está a HG Smart mais próxima?** | 🟡 lista todas, **sem busca por cidade nem localização** |
| **Como posso falar com essa loja agora?** | ✅ sim — WhatsApp por unidade e botão fixo em todas as páginas |

**Uma das quatro está plenamente resolvida.**

---

# HISTÓRICO DE ALTERAÇÕES

## 2026-08-06 — Etapa 2 · Páginas por unidade (SEO local)

**Regra seguida:** nenhuma mudança de layout, ordem de seção ou paleta. A única alteração
visual autorizada foi a coluna nova do rodapé.

| # | Alteração | Arquivos |
|---|---|---|
| D1 | **10 páginas de unidade** em `lojas/<id>/index.html`, geradas a partir de `data/lojas.json` | `ferramentas/gerar-lojas.js` (novo) + 10 páginas |
| D2 | Casca comum (head, cabeçalho, menu, marcador de pendência) extraída para módulo — o segundo gerador consome a mesma, não uma cópia | `ferramentas/layout.js` (novo), `gerar-paginas.js` |
| D3 | `MobilePhoneStore` extraído para módulo; `@id`/`url` deixaram de ser âncora (`/lojas#id`) e passaram a ser a própria página (`/lojas/<id>/`) | `ferramentas/schema-loja.js` (novo), `gerar-seo.js` |
| D4 | **Rota:** `lojas.html` → `lojas/index.html`, servindo `/lojas/`. O sitemap já publicava `/lojas` sem extensão, e o diretório novo colidiria com o arquivo | `lojas/index.html` + 83 referências em 21 arquivos |
| D5 | Sitemap passou de **13 para 23 URLs** — varre `lojas/*/index.html` no disco em vez de manter uma segunda lista | `gerar-seo.js`, `sitemap.xml` |
| D6 | Rodapé ganhou a coluna **"Nossas unidades"** com as 10, em HTML estático, nas 23 páginas | `aplicar-rodape.js` + 23 páginas |
| D7 | `aplicar-rodape.js` passou a varrer `lojas/` com prefixo por profundidade — antes só via a raiz, e as unidades nasceriam com rodapé congelado | `aplicar-rodape.js` |
| D8 | Cada cartão de loja ganhou link para a página da unidade (índice e home) | `assets/js/site.js` |
| D9 | Domingo de Cachoeirinha e Capão da Canoa entrou no dado, no cartão (selo) e no JSON-LD | `data/lojas.json`, `assets/js/site.js` |
| D10 | Servidor local passou a resolver diretório → `index.html`, com redirect para a barra final | `servidor-local.js` |
| — | `npm run lojas` registrado | `package.json` |

**Correções ao próprio checklist** (erros encontrados na verificação):
- A seção 10 dizia que `gerar-paginas.js` "monta o esqueleto das 10" unidades. **Falso** —
  aquele array tinha 8 entradas, todas institucionais, e o gerador de unidades não existia
- A seção 3 registrava só 4 lojas sem coordenada. São também **6 sem CEP**
- O `README.md` dizia "7 páginas montadas por template" (são 8 desde a Política de Cookies)
  e a árvore de estrutura não listava `politica-de-cookies.html`

**Correção de conteúdo que estava no ar:**
- O `data/lojas.json` afirmava que nenhuma unidade abre domingo. **Estava errado** — o dono
  confirmou Cachoeirinha e Capão da Canoa. O `faq.html` e o `README` estavam certos desde
  sempre; o dado é que estava incompleto

**Não feito, de propósito:**
- **Nenhum número de parcelamento** nas páginas de unidade. Com o B1 aberto (18x na arte do
  banner × 25x na página de Serviços), publicar um dos dois multiplicaria a contradição por
  dez. Formas de pagamento na unidade são só um link para `como-comprar.html`
- **Nenhum ponto de referência, vizinhança, foto ou avaliação por loja.** Não estão no
  cadastro. Onde falta dado saiu `pendencia()` visível e o campo saiu do JSON-LD

**Pendente de você:**
- Confirmar coordenada e CEP das 5 unidades marcadas com `B16-<cidade>` na seção 3
- Fotos de fachada das 10 (`B8-fotos`)
- Resolver o B1 — é ele que trava a copy de pagamento nas dez páginas

### Correções da revisão — 2026-08-06

| # | O que foi corrigido |
|---|---|
| R1 | **Texto de auditoria estava sendo publicado.** `gerar-lojas.js` lia `divergencias_com_o_site_antigo` e `pendencias` do JSON e imprimia no corpo indexável. A página de Cachoeira do Sul publicava o endereço **antigo** (`Rua Saldanha Marinho, 915`) ao lado do novo, em caixa alta e sem acento — dois endereços para o mesmo ponto, o NAP inconsistente que a seção 10 manda evitar. Corrigida a **causa**: os avisos públicos passaram a ser texto próprio do gerador, ligados por sinalizadores por loja (`endereco_em_confirmacao`, `endereco_sem_numero`) |
| R2 | Cópia morta de `horariosSchema()` sobrou em `gerar-seo.js` após a extração, referenciando `FAIXAS`, que o arquivo não importa mais — `ReferenceError` latente. Removida |
| R3 | `aria-current="page"` nas 10 unidades apontava para `/lojas/`, que não é a página atual. Virou `aria-current="true"` (item atual do conjunto), destaque visual mantido |
| R4 | Horário ou WhatsApp ausentes não geravam bloco **nem aviso**. Agora viram pendência visível |
| R5 | `name` do schema divergia do `<h1>` e do `<title>`. Os três passaram a sair de `nomeLoja()` |
| R6 | Cachoeirinha não sinalizava endereço em confirmação. Passou a sinalizar |
| R7 | `</script` escapado no JSON-LD |

> **Regra que passa a valer:** os blocos `divergencias_com_o_site_antigo` e `pendencias` de
> `data/lojas.json` são **registro interno de auditoria** e nunca podem alcançar página
> pública. Está escrito dentro do próprio JSON, na chave `_publico_x_auditoria`, para quem
> mexer nele depois. O que o visitante pode ver sai de campos próprios por loja.

### Dívida conhecida — avaliada e adiada de propósito

| Item | Por que fica |
|---|---|
| `data-prefixo` em `assets/js/site.js` poderia ser caminho absoluto em vez de relativo | O argumento é bom — caminho absoluto não depende da profundidade de quem monta o cartão. Mas está correto nos dois únicos usos (home e `/lojas/`), e trocar hoje é mexer em código que funciona por um benefício hipotético. Vale a troca quando surgir um terceiro lugar que monte cartão |
| `loja.id` não é validado contra path traversal antes de virar caminho de arquivo | O `id` vem de `data/lojas.json`, que é dado próprio do projeto, e o gerador roda na máquina de quem desenvolve — não há entrada de terceiro no caminho. Vira necessário se um dia o JSON passar a ser alimentado de fora |

## 2026-08-04 — Etapa 1

**Regra seguida:** só acrescentar ou desduplicar. Nenhuma estrutura de layout e nenhuma
ordem de seção foi alterada.

| # | Alteração | Arquivos |
|---|---|---|
| A1 | Política de Cookies deixou de ser página órfã — link acrescentado na faixa legal do rodapé | `ferramentas/aplicar-rodape.js` + 13 páginas |
| A2 | `MAPA-DO-SITE.md` e `PLANO-DE-APLICACAO.md` marcados como documento histórico, com aviso do que está desatualizado | 2 arquivos |
| B2 | Rótulo unificado: menu dizia "A rede", rodapé dizia "Quem Somos" → **"Quem Somos"** nos dois | 26 links em 13 páginas + `ferramentas/gerar-paginas.js` |
| C1 | Números de WhatsApp viraram chips clicáveis com ícone e alvo de toque de 44px | `assets/js/site.js` + `assets/css/src.css` + CSS recompilado |
| — | Versionamento Git iniciado, `.gitignore`, commit inicial e remote configurados | raiz do projeto |

**Correções ao próprio checklist** (erros meus, encontrados na verificação):
- A home **tem** seção de avaliações ("Quem já comprou", com as 20) — estava marcada como ❌
- A home tem **11 seções**, não 9 — o `MAPA-DO-SITE.md` estava desatualizado
- Recomendação de schema `Review`/`AggregateRating` **retirada** — a política do Google não
  aceita avaliação de terceiro marcada como própria

**Não aplicado (você optou por manter):**
- B1 — desduplicar o slider. As 5 artes repetidas de boleto seguem no ar, e com elas a
  contradição do 18x × 25x

**Pendente de você:**
- `git push -u origin main` — este ambiente não abre janela de login do GitHub
