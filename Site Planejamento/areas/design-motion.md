# 🎨 Design, Motion e 3D — Novo Site HG Smart

> Direção criativa, referências nível Awwwards e especificação técnica de motion/3D.
> Fontes: consultoria de design + pesquisa aprofundada de referências (Leva 12)

## Direção criativa aprovada para discussão — 3 pilares

1. **Abertura de marca cinematográfica (leve):** preloader de ~1,2–1,8s em HTML/CSS/SVG + GSAP — logo "HG Smart" revelado por wipe/preenchimento + contador 0–100 na cor da marca; a cortina sobe e revela o hero (que carrega POR TRÁS, mascarando o loading). Dispara **uma vez por sessão** (cookie/sessionStorage). Zero WebGL.
2. **Celular herói 3D fotorrealista guiado pelo scroll:** UM aparelho (ex.: modelo mais vendido) renderizado no Blender com HDRI, exportado em **~90–120 frames WebP** e reproduzido em `<canvas>` com GSAP ScrollTrigger (`pin` + `scrub`) — a "técnica da Apple" (image-sequence / falso 3D). O celular gira/reangula conforme o scroll passa pelas seções de pagamento. Micro-tilt seguindo o cursor por cima (parallax leve do canvas).
3. **Dinâmica de cor por seção:** fundo/acento interpolando a cada forma de pagamento — **Boleto → Conta de Luz → Crédito CLT → Cartão**, cada uma com sua cor. Custo de performance quase nulo, impacto altíssimo.

## Por que "falso 3D" (image-sequence) e não WebGL pesado

- O efeito "muito realista" da Apple (AirPods Pro, iPhone) **não é 3D ao vivo**: são frames pré-renderizados desenhados num canvas conforme o scroll (na AirPods Pro: 65 PNGs = 15,2 MB; em WebP cairia ~90%, para ~1,7 MB)
- Entrega realismo de render de estúdio com custo de runtime baixíssimo → compatível com o compromisso de **site extremamente rápido** e LCP/INP/CLS
- Three.js real pesa ~155 KB gzip + compilação de shaders e ameaça o INP no mobile — reservar para uma eventual v2
- **Gatilho de decisão:** só migrar para Three.js/R3F se o cliente exigir rotação 360° livre + troca de cor de material em tempo real E o protótipo mantiver LCP ≤ 2,5s / INP ≤ 200ms num Android intermediário

## Referências (nível Awwwards, com links)

### Abertura / preloaders
| Referência | O que mostra |
|---|---|
| Igloo Inc — awwwards.com/sites/igloo-inc | **Site of the Year 2024**; intro cinematográfica que estabelece o tom antes do conteúdo (estúdio Abeto; Three.js/GSAP/Houdini/Blender) — copiar a *ideia*, executar em CSS/SVG |
| Coleção Loading Animations — awwwards.com/awwwards/collections/loading-page/ | 542 preloaders premiados: contadores, wipes, logo reveals |
| htmlburger.com/blog/website-preloaders/ · oma-kase.com/blog/best-framer-preloader-components | Padrões "logo fill", "0–100", wipe editorial, disparo 1×/sessão |

### Produto 3D realista no scroll (referência central)
| Referência | O que mostra |
|---|---|
| **Apple AirPods Pro / iPhone** — apple.com/airpods-pro | A técnica-mãe: image-sequence em canvas guiada pelo scroll. Modelo nº 1 para o celular herói |
| **Oryzo (Lusion)** — oryzo.ai | Site of the Month abr/2026 + Developer Award; UM objeto herói com peso/inércia em Three.js. Filosofia: "venda um objeto direito". *(projeto fictício — referência de técnica, não de e-commerce)* |
| **Cartier Watches & Wonders 2026** — cartier.com/en-fr/watchesandwonders | "Uma sala 3D por relógio" navegada pelo scroll → adaptável como "uma cena por forma de pagamento" |
| **Shopify Editions Spring 2026** — shopify.com/editions/spring2026 | Cada seção como um "beat" coreografado (entrada/hold/saída) |
| **Mana Yerba Mate** (Site of the Year 2023) | Produto sempre em foco girando enquanto o texto muda ao redor |
| Curadoria Three.js 2026 — utsubo.com/blog/best-threejs-websites-2026 | Referências com técnica confirmada |

### Fintech (analogia com "pagamento facilitado")
| Referência | O que mostra |
|---|---|
| Mastercard Business Outcomes — awwwards.com/sites/mastercard-business-outcomes | SOTD; 3D/WebGL/Blender em tema de pagamentos |
| Marqeta · Jeton · design.cash.app | Cartão 3D acompanhando o scroll; UX fintech premiada |
| github.com/thounny/DAY_018 | Card flip 3D no scroll (GSAP+ScrollTrigger+Lenis, código aberto) |

### Dinâmica de cor
- Padrão GSAP ScrollTrigger p/ trocar cor por seção: gsap.com/community/forums/topic/25798 · codepen.io/reksaandhika/pen/gOzmeyv

### ⚠️ NÃO usar como referência
- **Nothing Phone** e **página do Google Pixel**: verificação direta mostrou páginas **estáticas** (sem 3D/scroll-scrubbing), apesar da fama
- OnePlus/Samsung/Xiaomi: provavelmente usam image-sequence em algumas páginas, mas **confirmar no DevTools** antes de citar (procurar `<canvas>` fixado + requisições sequenciais de frames)

## Ferramentas — quando usar cada uma

| Ferramenta | Quando usar | Trade-off |
|---|---|---|
| **Image-sequence em canvas** | Realismo máximo guiado pelo scroll (recomendação central) | Peso dos frames (usar WebP + lazy) |
| **GSAP + ScrollTrigger** | Base de tudo: `pin` fixa a seção, `scrub` amarra ao scroll | — |
| **Lenis** | Smooth scroll "físico" sincronizado ao GSAP | ~150 KB no combo; parcimônia no mobile |
| **CSS scroll-driven nativo** | Reveals simples e troca de cor sem JS | Menos controle |
| **Three.js** | Reação livre ao cursor, 360°, cor de material ao vivo | ~155 KB gzip + shaders; risco INP |
| **R3F (React Three Fiber)** | Se o site for React e houver especialista | Peso do React por cima |
| **Spline** | Protótipo rápido sem especialista 3D | Bundle maior; Three.js vence em produção |
| **glTF/GLB + Draco + KTX2** | Só se houver 3D real (compressão de modelo/textura) | — |
| **Rive** (vs Lottie) | Microinterações interativas com state machine, arquivos 3–5× menores | — |

## Pipeline de realismo (produção do render)

1. Modelo 3D do celular: bibliotecas (CGTrader, Sketchfab) ⚠️ **verificar licença comercial de modelos de marcas** — ou modelagem própria
2. Blender/Cinema 4D: materiais PBR + **iluminação HDRI/IBL** (reflexos realistas na tela de vidro: luzes grandes e difusas + três pontos)
3. Animar rotação/reangulação suave → exportar **90–120 frames WebP**
4. Integrar no canvas com pin/scrub + pré-carregamento inteligente

## Guarda-corpos de performance e SEO (inegociáveis)

- Conteúdo (headline, preços, CTAs) sempre em **HTML real** — nunca desenhado no canvas (SEO + OAI-SearchBot + LCP)
- 3D/frames adiados por IntersectionObserver; **nunca** lazy no elemento LCP; reservar dimensões do canvas (CLS)
- Metas: **LCP ≤ 2,5s · INP ≤ 200ms · CLS ≤ 0,1** no p75 de campo (CrUX), medidos em Android intermediário
- Fallback para dispositivos fracos: menos frames/resolução ou imagem estática; tilt desligado no mobile se INP sofrer
- `prefers-reduced-motion`: mostrar frame estático e pular a abertura
- Preloader mascara o loading do hero (carrega por trás) — melhora a percepção, não soma tempo

## Esforço estimado (para o dev)

| Entrega | Esforço |
|---|---|
| Preloader + reveal de marca | Baixo (1–2 dias) |
| Troca de cor por seção (GSAP+Lenis) | Baixo (1–2 dias) |
| Celular herói image-sequence (render Blender + canvas + scrub + fallbacks) | Médio (~1–2 semanas; o render é o gargalo — encomendar na semana 1) |
| Alternativa Three.js/R3F real | Alto (semanas; exige especialista 3D) — só em v2 |

## A confirmar / decidir

- [ ] Aprovar a direção criativa dos 3 pilares com o Eduardo/time
- [ ] Escolher o aparelho herói (modelo mais vendido?) e encomendar o render 3D (semana 1)
- [ ] Verificar licença de uso comercial do modelo 3D do aparelho
- [ ] Definir as 4 cores das seções de pagamento (integrar com identidade da marca)
- [ ] Medir LCP/INP/CLS do protótipo em Android intermediário antes de considerar WebGL real

---

# AUDITORIA AO VIVO DE SITES PREMIADOS (Leva 13)

> Inspeção de código, bibliotecas, canvas WebGL, fontes e CSS de 3 vencedores de Site of the Day com perfis distintos.

## Stacks encontradas

| Site | Base | Motion/Scroll | 3D/WebGL | Tipografia |
|---|---|---|---|---|
| **Serotoninn** (fashion) | WordPress custom | Lenis + transforms | — | Thunder (condensada) + PP Fraktion Mono |
| **Lacoste Ace Breaker** (brand game) | Vue | custom | WebGL2 fullscreen + WebGPU | Mona Sans + serif display |
| **No Art** (music label) | Webflow | GSAP + Lenis | Three.js (WebGL2) | JetBrains Mono, Chivomono, Rock Salt |

**Dado revelador:** nenhum usa só HTML/CSS. A "receita" do look Awwwards é sempre: base leve (WordPress/Webflow/framework) + camada de animação sofisticada — **GSAP** (timeline/motion), **Lenis** (smooth scroll inercial), **Three.js/WebGL2** (3D e textura) e **Swiper** (carrosséis). ✅ *Valida a stack já recomendada para a HG Smart.*

## Direções de layout observadas

1. **Grid editorial/brutalista** (No Art): crop marks tipográficos nos 4 cantos do viewport, colunas justificadas em mono, títulos display gigantes em caixa alta — linguagem de revista/interface técnica
2. **Fashion-editorial** (Serotoninn): contador percentual gigante ("00%") como elemento gráfico, tags entre colchetes ("[BE YOURSELF]"), selos "BEST SELLER" desenhados à mão sobre o grid de produtos
3. **Imersivo fullscreen** (Lacoste): a interface É uma cena 3D em tempo real com UI mínima e um único CTA — o layout serve à narrativa

**Padrão transversal — tipografia como protagonista:** display serifada/condensada para impacto × monoespaçada para apoio (ar técnico/editorial), com toque manuscrito pontual para contraste humano.

## Efeitos visuais recorrentes

- **`mix-blend-mode` em escala massiva** (168 elementos no Serotoninn, 43 no No Art): texto/cursor que inverte/reage ao fundo ao passar sobre imagens — o efeito de composição mais característico do look premiado, e barato
- **`clip-path`** para revelações de máscara
- Gradientes radiais e glows (brilho amarelo do preloader Lacoste)
- **Granulação/ruído** e traço "tremido" desenhado à mão (preloader Serotoninn)
- **Preloader como assinatura de marca**: bola de tênis girando + barra (Lacoste), contador de % (Serotoninn) — a espera vira branding ✅ *valida o Pilar 1 da HG Smart*

## Padrões de motion

- **Lenis + GSAP** (Serotoninn, No Art): scroll com inércia "pesada e fluida" + revelações de texto **linha a linha**, parallax entre camadas e transições coreografadas por scroll
- **Three.js no hero** (No Art): vídeo/imagem de fundo passando por camada WebGL para distorção/revelação de textura
- **WebGL2/WebGPU em tempo real** (Lacoste): experiência gamificada fullscreen — o extremo do espectro (não recomendado para a HG Smart v1)
- Carrosséis: **Swiper** com transições customizadas em todos

## A fórmula do site premiado (síntese da auditoria)

> Base leve + **Lenis** (scroll assinatura) + **GSAP** (revelações e parallax) + **Three.js/WebGL** (hero e textura) + **mix-blend-mode e clip-path** (composição) + **tipografia display × mono ousada** + **preloader animado como cartão de visita**.

## Aplicação prática na HG Smart (novos itens a partir da auditoria)

- [ ] **Pareamento tipográfico**: escolher uma display condensada/impactante para títulos + uma mono para dados técnicos (parcelas, preços, specs) — reforça o ar "editorial premium"
- [ ] Adotar **mix-blend-mode** no cursor/títulos sobre fotos das lojas e produtos (efeito-assinatura de custo quase zero)
- [ ] **clip-path** nas revelações de seção e nas fotos das unidades
- [ ] Revelação de texto **linha a linha** (GSAP SplitText) nos títulos das seções de pagamento
- [ ] Grain/ruído sutil na abertura, ecoando o traço vermelho da marca
- [ ] Carrosséis (produtos/avaliações) em **Swiper** com transição customizada

---

# TRIAGEM DE RECURSOS E FERRAMENTAS (Leva 14)

> Lista de repositórios/recursos avaliada contra a direção do projeto. Links completos na fonte original.

## 🟢 Adotar já (Etapas 1–2)

| Recurso | Uso no projeto |
|---|---|
| **DESIGN.md da HG Smart** (base: VoltAgent/awesome-claude-design, 68 sistemas) | Criar o design system em Markdown para desenvolvimento assistido por IA: tokens de cor (4 cores por forma de pagamento), tipografia display×mono, espaçamentos, specs de motion → **entrega da Etapa 1** |
| **Skills de Claude Code**: DevMartinese/awwwards-animations-skill · emilkowalski/skills · LottieFiles/motion-design-skill | Instalar no ambiente do dev para elevar o padrão do código de animação gerado |
| **devanshutak25/3d-resources** (3.400+ CC0) | Buscar modelo 3D de celular **CC0** → resolve a pendência de licença comercial |
| **Codrops/Tympanus** · **Olivier Larose** | Tutoriais com código dos efeitos especificados (image-sequence, preloader, mix-blend-mode, clip-path) |
| **Origamid** (PT-BR) | Capacitação estruturada do time em front-end/animação |
| **motion** (ex-Framer, 33k⭐) + **ibelick/motion-primitives** | Micro-interações de UI em React (GSAP segue dono do scroll — não empilhar orquestradores) |
| **romboHQ/tailwindcss-motion** | Se o stack usar Tailwind: micro-animações utilitárias |
| Links dos sites auditados (Leva 13) | serotoninn.com · members-play.lacoste.com/ace-breaker-rg · noartmusic.com |

## 🟡 Reservar para a v2 (Three.js real)

- **pmndrs/react-three-fiber** (31,7k⭐) — quando/se migrar para 3D ao vivo
- **AxiomeCG/awesome-threejs** · **vanrez-nez/awesome-glsl** — referências e shaders
- **Three.js Journey** (Bruno Simon) — formação do dev para a v2
- Projetos-exemplo para estudo: **Naresh-Khatri/3d-portfolio** (Next.js+GSAP+Motion — nossa stack) · **ThreeJS-Celestial-Forge** (recriação de site Awwwards) · **discoverthreejs-site**

## 🔴 Descartados (não alinham com o projeto)

- **PSD → HTML** (grupo todo) — workflow legado; o caminho é DESIGN.md + componentes
- **animate.css** — genérico demais para o nível pretendido
- **tengbao/vanta** — backgrounds 3D pesados, briga com o LCP mobile
- **mojs · popmotion · react-move · ant-motion · motionity** — redundantes com GSAP/Motion
- **galacean/engine · polygonjs** — engines fora do escopo

## Regra de ouro da triagem

> Um orquestrador de scroll (GSAP), um smooth scroll (Lenis), um caminho de realismo (image-sequence) e um design system em Markdown guiando a IA. Todo o resto é complemento pontual ou v2.
