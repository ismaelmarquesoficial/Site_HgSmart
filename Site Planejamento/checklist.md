# ✅ Checklist de Produção e Verificação — HG Smart

> Atualizado a cada leva. Legenda: ✅ feito · 🟡 em andamento · ⬜ pendente

## 📦 Produção dos documentos (esta organização)

| Item | Status |
|---|---|
| Documento cérebro | 🟢 Atualizado (Leva 14) |
| Institucional · Produtos · Vendas · Canais · Marketing | 🟢/🟡 |
| Projeto Novo Site 2026 | 🟢 Ampliado (Levas 6, 10 e 11) |
| Design, Motion e 3D | 🟢 Ampliado na Leva 13 (auditoria de premiados + fórmula) |

## 🚀 PROJETO NOVO SITE 2026 — Checklist de produção

### Etapa 1 — Organização
- [ ] Confirmar menu e páginas
- [x] Endereços oficiais das 10 lojas ✅ (Leva 7)
- [x] Horários das 10 lojas ✅ (Leva 8)
- [x] WhatsApps oficiais das 10 lojas ✅ (Leva 9)
- [ ] ⚠️ Corrigir dígito faltante no 1º WhatsApp de SCS antes de publicar
- [ ] Completar por loja: CEP, Instagram, telefone fixo
- [ ] Confirmar domingo fechado + horários especiais/feriados (Perfil Google)
- [ ] Número do endereço de Farroupilha
- [ ] Definir tratamento de Pelotas no site ("em breve"? página de captação?)
- [ ] Separar fotos reais (fachadas, equipe, operação)
- [ ] Aprovar textos dos **8 slides** (briefing final — slide de acessórios saiu)
- [ ] 🎬 Produzir vídeo institucional do CEO Eduardo Hermes
- [ ] ✍️ Redigir as 9 respostas do FAQ oficial (alimentam o schema FAQPage)
- [ ] 🎨 Aprovar direção criativa de motion/3D (preloader + celular herói image-sequence + cor por seção)
- [ ] 🖥️ Escolher o aparelho herói e encomendar o render 3D no Blender (90–120 frames WebP) — gargalo, priorizar
- [ ] ⚖️ Verificar licença comercial do modelo 3D do aparelho
- [ ] 🔤 Definir pareamento tipográfico (display condensada p/ títulos + mono p/ preços e parcelas)
- [ ] 📐 Criar o **DESIGN.md da HG Smart** (tokens de cor, tipografia, motion) — base: awesome-claude-design
- [ ] 🤖 Instalar skills de motion no Claude Code do dev (awwwards-animations, emilkowalski, motion-design)
- [ ] 🆓 Buscar modelo 3D de celular **CC0** no 3d-resources (resolve a pendência de licença)
- [ ] ⚠️ Definir nº oficial do boleto (18x × 25x) — **bloqueia os textos**
- [ ] ⚠️ Validação jurídica do slide/página de aporte financeiro

### Etapa 2 — Desenvolvimento
- [ ] Página inicial (estrutura final de 11 blocos — briefing Leva 11)
- [ ] Localizador de lojas (busca por cidade + geolocalização)
- [ ] Páginas individuais das unidades (conteúdo exclusivo por loja)
- [ ] 6 páginas de formas de pagamento
- [ ] Central de contato (WhatsApp, e-mail, tickets, formulário)
- [ ] 🆕 Botão de WhatsApp fixo em todas as páginas
- [ ] 🎬 Preloader/abertura de marca (CSS/SVG + GSAP, 1×/sessão, ~1,2–1,8s) — esforço baixo
- [ ] 🌈 Dinâmica de cor por seção de pagamento (GSAP ScrollTrigger) — esforço baixo
- [ ] 📱 Celular herói em image-sequence no canvas (pin/scrub + fallbacks + prefers-reduced-motion) — esforço médio
- [ ] ✨ Efeitos de composição: mix-blend-mode (cursor/títulos) + clip-path (revelações) + texto linha a linha (SplitText)
- [ ] 🎠 Carrosséis de produtos/avaliações em Swiper com transição customizada
- [ ] Painel para o marketing atualizar banners/lojas/conteúdos

### Etapa 3 — SEO e mensuração
- [ ] Títulos, descrições e URLs exclusivos
- [ ] Dados estruturados LocalBusiness (por loja) + produtos
- [ ] GA4 + Search Console + Tag Manager + Pixel Meta
- [ ] Eventos e conversões configurados
- [ ] Sitemap XML + indexação (Google **e Bing** + IndexNow)
- [ ] Liberar OAI-SearchBot no robots.txt (visibilidade no ChatGPT)
- [ ] Schema.org completo: Organization + LocalBusiness por loja + Produto + **FAQPage** + **Avaliações (Review)**
- [ ] Robots.txt configurado (com OAI-SearchBot liberado)
- [ ] Rastrear cliques de WhatsApp, ligações e rotas

### Etapa 4 — Lançamento e manutenção
- [ ] Conferência geral de informações
- [ ] Testes mobile + todos os WhatsApps e mapas
- [ ] Publicação
- [ ] Rotina: ofertas/conteúdos mensais + revisão de desempenho a cada 30 dias
- [ ] Google Perfil da Empresa criado/conferido por unidade (padrão completo)

### 🗓️ Plano 90 dias (cronograma da estratégia SEO/IA)
- [ ] **D1–15:** lista oficial de unidades · confirmar dados e ofertas · 10–15 palavras-chave por cidade · mapear concorrentes · corrigir Perfis Google
- [ ] **D16–45:** publicar páginas de lojas + pagamentos · dados estruturados + rastreamento · OAI-SearchBot · sitemaps Google/Bing · processo de avaliações
- [ ] **D46–90:** 4 conteúdos/mês · 1+ atualização local por unidade · menções em sites das cidades · medir e reforçar

### 🔁 Rotinas contínuas (pós-lançamento)
- [ ] Gerentes: envio SEMANAL de fotos, produtos, seminovos à pronta entrega, campanhas, horários e vídeos
- [ ] ⚖️ Compliance: pedir avaliações via QR/WhatsApp a clientes reais — **NUNCA oferecer brinde/desconto em troca** (política do Google)
- [ ] Manter dados idênticos em site, Google, Instagram e diretórios
- [ ] Páginas de Capão da Canoa e Tramandaí **sem** oferta de conta de luz

### Entregas do Marketing
- [ ] Textos dos slides · fotos das lojas · dados das unidades
- [ ] Infos das formas de pagamento · FAQ · lista de produtos
- [ ] História da HG Smart e do CEO Eduardo Hermes
- [ ] 2–4 conteúdos/mês (pauta definida na estratégia)

### Entregas do Desenvolvedor
- [ ] Layout/mobile/velocidade (LCP, INP, CLS monitorados)
- [ ] Integrações + SEO técnico + rastreamento de conversões
- [ ] Segurança, HTTPS e manutenção

## 🛠️ Correções no site/blog ATUAIS

| Item | Onde | Prioridade |
|---|---|---|
| Unificar nº de parcelas (18x × 25x) em todas as páginas | Site todo | Alta |
| Newsletter com placeholder "FooBar" | Blog | Alta |
| Privacy Policy vazia ("#") — novo site exigirá políticas completas | Blog | Alta (LGPD) |
| Unificar perfis sociais (site × blog) | Site + Blog | Alta |
| Blog atual viola diretriz da nova estratégia (páginas repetidas por cidade = doorway pages) | Blog | Média — revisar na migração |
| Rodapé do blog credita "ThemeSphere" | Blog | Baixa |

## 🔍 Verificação (dados a confirmar)

| Item | Impacta |
|---|---|
| ⚠️ Boleto: bater oficialmente 18x (2 docs internos dizem 18x; site atual diz 25x) · entrada mantém 10–30%? | vendas + site novo |
| Medir LCP/INP/CLS do protótipo motion em Android intermediário (gate p/ WebGL real) | design-motion.md |
| Lista de cidades COM/SEM conta de luz (Capão e Tramandaí já confirmadas SEM) | vendas + páginas das lojas |
| Perfis sociais oficiais | canais + rodapé novo |
| Crédito CLT: mecânica, financeira, limites | vendas |
| Troca de usado: critérios de avaliação | vendas |
| Conta de luz: teto de valor? conta precisa estar no nome? | vendas + FAQ |
| Garantia estendida: preços, prazos, coberturas | produtos |
| Assistência técnica 2026: ativa? escopo? | produtos |
| Troop Telecom: planos e preços | produtos |
| Franquia: ativa? próprias × franqueadas | institucional |
| Ano de fundação · significado de "HG" · razão social | institucional |
| Nº oficial de lojas e clientes (seção Sobre) | institucional + site |
| Financeiras parceiras (nomes) · desconto Pix | vendas |
| RG e/ou CNH por forma de pagamento | vendas |

### ✅ Resolvidos

| Item | Leva | Resposta |
|---|---|---|
| Lista oficial de lojas | 7 | **10 unidades** (SCS, Lajeado, Cachoeira do Sul, Capão, Caxias, Cachoeirinha, Tramandaí, Santa Maria, Farroupilha, Bento) + **Pelotas em breve** |
| Horários de atendimento | 8 | 3 padrões: até 19h (SCS/Lajeado/Sta Maria) · até 18h30 (demais) · litoral 09h–18h |
| WhatsApps por unidade | 9 | 2 por loja (SCS tem 4) — os 3 do site atual são da matriz SCS |
| Fundador/CEO | 5 | **Eduardo Hermes** (Grupo Hermes) |
| Outros itens de tecnologia | 5 | Alexa, smartwatches, power banks, suportes |
| Marca própria | 5 | Películas HG Fiber/HG Premium + capinhas HG Smart |
| Assistência técnica existe? | 4 | Sim (2024) — status 2026 pendente |
| Cidades de atuação (indícios) | 4–5 | 9 cidades + SCS |
| Entrada do boleto | 3 | 10–30% (reconfirmar) |
| Conta de luz | 3+5 | 24x, RGE, **sem entrada** |
| Marcas | 2–5 | Apple, Samsung, Motorola, Xiaomi, Realme + itel, BLU, Infinix, LG |
| Missão/Visão/Valores | 2 | Documentados |

## 📥 Levas recebidas

- [x] **Leva 1** — Home do site
- [x] **Leva 2** — Quem Somos
- [x] **Leva 3** — Serviços
- [x] **Leva 4** — Blog
- [x] **Leva 5** — Estratégia do Novo Site 2026 (doc interno)
- [x] **Leva 6** — Estratégia de SEO Local e Busca por IA (doc interno)
- [x] **Leva 7** — Lista oficial de endereços das lojas (07/08/2026)
- [x] **Leva 8** — Horários de atendimento das 10 lojas (07/08/2026)
- [x] **Leva 9** — WhatsApps oficiais por unidade (mensagem de 26/07/2026)
- [x] **Leva 10** — SEO técnico consolidado + objetivo do site
- [x] **Leva 11** — Briefing final do novo site (estrutura de 11 blocos + FAQ)
- [x] **Leva 12** — Direção criativa de design/motion/3D + pesquisa de referências (07/08/2026)
- [x] **Leva 13** — Auditoria ao vivo de sites premiados: Serotoninn, Lacoste, No Art (07/08/2026)
- [x] **Leva 14** — Triagem de recursos e ferramentas (repos, skills, bibliotecas, canais)
- [ ] Próximas levas…
