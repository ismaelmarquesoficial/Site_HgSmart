# Design System — Rede HG Smart

Fonte de verdade visual do site. Escrito para ser lido por pessoa e por
agente de IA: quem for mexer no site decide olhando daqui, não recriando
do zero.

**A identidade não se discute aqui.** Bebas Neue, Inter e o azul `#00a2c7`
vêm da marca. Este documento define como usá-los — não os substitui.

---

## Princípios

Cinco frases que decidem empate. Quando duas soluções parecerem
igualmente boas, é isto que desempata.

1. **O conteúdo não depende de JavaScript.** Texto, cartões, números e
   imagens estão no HTML. O JS acrescenta movimento; sem ele a página é
   lida inteira. Isso não é acessibilidade abstrata — é o buscador
   entendendo as dez lojas sem executar script.

2. **Movimento conduz o olhar; não disputa com ele.** Se uma animação
   obriga a esperar para ler, ela está errada. Nada segura o visitante
   parado por mais de uma tela de rolagem.

3. **O dado é o ornamento.** "10 lojas", "18x", "44x", os nomes das
   cidades — esses números são o material gráfico da marca. Antes de
   inventar uma forma decorativa, use o dado em corpo grande.

4. **Nada de vidro sobre foto.** Cartão translúcido sobre imagem deixa o
   fundo vazar e suja o texto. Ou o conteúdo tem fundo sólido próprio, ou
   a imagem fica sozinha. Já erramos assim uma vez.

5. **O que não se sabe não se publica.** Falta o dado, entra o cartão de
   pendência visível. Placeholder invisível vira conteúdo publicado por
   esquecimento.

---

## Cor

Tokens nomeados por **função**, não por matiz. Um dia o azul muda; o
nome `--acao` continua valendo.

| Token | Valor | Onde usar |
|---|---|---|
| `--fundo` | `#07080a` | fundo da página |
| `--fundo-2` | `#0d1117` | seção alternada, cartão sólido |
| `--fundo-3` | `#05070a` | rodapé, faixas de descanso |
| `--tinta` | `#ffffff` | texto principal sobre escuro |
| `--tinta-2` | `rgba(255,255,255,.76)` | texto de apoio, parágrafo |
| `--tinta-3` | `rgba(255,255,255,.5)` | rótulo, legenda, dado secundário |
| `--acao` | `#00a2c7` | o azul da marca: link, destaque, foco |
| `--acao-clara` | `#16b7dc` | hover do azul |
| `--acao-tinta` | `#00232c` | texto sobre o azul |
| `--linha` | `rgba(255,255,255,.12)` | filete, divisória, borda |
| `--linha-forte` | `rgba(255,255,255,.24)` | borda de elemento interativo |

**Regras**

- O azul é **acento**, não superfície. Nunca preencher uma seção inteira
  com ele; a marca ganha peso por contraste, não por área.
- Contraste mínimo de 4.5:1 para texto corrido. `--tinta-3` só para
  texto de 14px ou maior, e nunca para informação essencial.
- Vermelho, verde e amarelo só existem em estado de sistema (erro,
  sucesso, alerta). Não entram na paleta de composição.

---

## Tipografia

Duas famílias, já auto-hospedadas. **Não acrescentar uma terceira.**

- **Bebas Neue** — display. Só título. Caixa alta por desenho, então
  nunca aplicar `text-transform` nela (dobra o processamento e não muda
  nada).
- **Inter variável (100–900)** — todo o resto. Peso é a ferramenta de
  hierarquia aqui, não tamanho.

### Escala

Fechada. Valor fora da escala não entra.

| Nome | Tamanho | Uso |
|---|---|---|
| `d1` | `clamp(3rem, 9vw, 8rem)` | título de abertura, um por página |
| `d2` | `clamp(2.25rem, 6vw, 5rem)` | título de capítulo |
| `d3` | `clamp(1.5rem, 3.2vw, 2.5rem)` | subtítulo, nome de bloco |
| `t1` | `clamp(1.0625rem, 1.5vw, 1.3125rem)` | parágrafo de destaque |
| `t2` | `1rem` | corpo |
| `t3` | `.875rem` | apoio, legenda |
| `r1` | `.6875rem` | rótulo — maiúscula, `letter-spacing: .16em` |

### Regras que mais erram

- **Máscara de texto precisa de respiro em cima e embaixo.** `overflow:
  hidden` decepa o acento agudo — "próximo" vira "proximo" — e a cedilha
  embaixo. Use `padding: .16em 0 .1em` com margem negativa equivalente.
- Peso de parágrafo: **300 a 400**. Abaixo de 300 o Inter fica lavado
  sobre fundo escuro.
- `line-height`: `.9` a `1.0` no display, `1.55` a `1.68` no corpo.
- Medida de leitura: **58ch** no máximo. Acima disso o olho perde a
  linha.

---

## Espaçamento

Escala única, em rem. **Valor fora dela não entra.**

```
0.25  0.5  0.75  1  1.5  2  3  4  6  8  12
```

Ritmo vertical das seções: `clamp(5rem, 14vh, 10rem)` de padding em
cima e embaixo. Respiro lateral: `clamp(1.5rem, 6vw, 6rem)`.

---

## Grid

12 colunas, `gap` de 1.5rem, largura máxima de 90rem centralizada.

| Faixa | Colunas úteis | Comportamento |
|---|---|---|
| ≥ 1280px | 12 | layout completo, degrau editorial permitido |
| 860–1279px | 8 | colunas de conteúdo colapsam para 2 |
| < 860px | 4 | tudo empilha; sem degrau, sem sobreposição |

**Degrau editorial:** o parágrafo de um capítulo recua da margem do
título (`margin-left: clamp(0, 8vw, 9rem)`). É o que dá ar de página
diagramada em vez de tudo grudado à esquerda. Some abaixo de 860px.

---

## Movimento

### Durações e curvas

| Nome | Duração | Curva | Uso |
|---|---|---|---|
| `micro` | 200ms | `cubic-bezier(.2,.7,.3,1)` | hover, foco, botão |
| `entrada` | 600ms | `cubic-bezier(.16,1,.3,1)` | elemento entrando na tela |
| `cena` | 900ms | `power3.out` | título, bloco de capítulo |
| `scrub` | ligada ao scroll | `none` | sequência de vídeo |

### Regras

- **Animar só `transform` e `opacity`.** `width`, `height`, `top`,
  `left` e `margin` forçam layout a cada quadro. Para crescer um
  elemento, use `scale` e desfaça a escala no filho.
- **Scrub sempre com inércia** (`scrub: 0.5` a `0.6`). Em `scrub: true`
  o movimento fica seco e denuncia a mecânica.
- **Nada de `pin` no mobile.** Abaixo de 1024px o pin briga com a altura
  dinâmica da viewport e a barra do navegador.
- **`prefers-reduced-motion` desliga tudo**, inclusive o scroll suave.
  Sequestrar a rolagem de quem pediu menos movimento é o oposto do que
  se deve fazer. Nesse modo, a experiência vira página estática com o
  conteúdo inteiro visível.
- Animação fora da tela **não roda**. Toda timeline nasce presa a um
  ScrollTrigger ou a um IntersectionObserver.

### Animação de texto

Três padrões, e só três:

1. **Máscara por linha** — a linha sobe de baixo, com `stagger` de 15ms
   a 40ms entre linhas. É o padrão de título de capítulo.
2. **Fade com deslocamento curto** — `opacity 0→1` + `y: 24px→0`. Para
   parágrafo e blocos de dado. Nunca mais de 32px de deslocamento: acima
   disso a leitura começa antes do elemento chegar.
3. **Contagem numérica** — só para os números da rede, e só uma vez por
   página. Com movimento reduzido, mostra o valor final direto.

**Não usar:** letra por letra (ilegível em título grande), blur na
entrada (custa GPU e parece defeito de renderização), rotação em texto.

---

## Componentes

### Botão

| Variante | Uso |
|---|---|
| primário | fundo `--acao`, texto `--acao-tinta`. Um por tela. |
| secundário | borda `--linha-forte`, fundo transparente |
| textual | só o rótulo com filete que cresce no hover |

**Estados obrigatórios:** repouso, hover (`translateY(-2px)`), foco
visível (anel de 2px em `--acao`, nunca `outline: none` sem substituto),
ativo, desabilitado (opacidade .45 e `cursor: not-allowed`).

Alvo de toque mínimo: **44×44px**.

### Cartão

Fundo **sólido** (`--fundo-2`), borda `--linha`, raio 1rem. Sobre
imagem, ou o cartão é opaco ou não existe.

**O que não fazer:** `backdrop-filter` sobre foto (o fundo vaza e o
texto perde legibilidade); sombra colorida; borda em gradiente.

### Capítulo

Anatomia fixa: número (mono, `--acao`) → título (`d2`) → parágrafo com
degrau (`t1`, máx. 58ch) → conteúdo. Fundo alterna entre `--fundo` e
`--fundo-2` a cada capítulo, para dar ritmo sem linha divisória.

### Passagem de vídeo

Canvas em tela cheia, `position: sticky`. **Sem interface por cima** —
no máximo uma frase curta no rodapé, que entra e sai.

Trecho de vídeo **distinto por passagem**. Trechos contínuos do mesmo
arquivo, separados por um capítulo, leem como se o vídeo tivesse
voltado — o fim de um e o começo do outro são quadros quase idênticos.

### Indicador de scroll

Só na primeira tela. Rótulo em `r1` + seta com movimento de 5px. Some
depois do primeiro gesto de rolagem e não volta.

---

## Mobile

- Percurso **mais curto**: cada passagem de vídeo perde metade da altura
  de rolagem.
- Sequência de quadros com **menos da metade** dos quadros e resolução
  menor — a conta é de bateria e memória de decodificação, não só de
  peso de arquivo.
- Elemento posicionado em coordenada absoluta sobre a cena **vira faixa
  rolável** no rodapé. Espalhado numa tela pequena ele se sobrepõe e o
  alvo de toque fica abaixo do mínimo.
- Sem `pin`, sem parallax de cursor, sem hover como único caminho para
  uma informação.

---

## Performance

Orçamento por página, medido e não estimado:

| Recurso | Teto |
|---|---|
| Primeira imagem (LCP) | 150 KB |
| CSS | 60 KB |
| JS de terceiros | 150 KB (GSAP + ScrollTrigger + Lenis, locais) |
| Sequência por passagem | 4 MB, carregada por proximidade |

**Metas:** LCP ≤ 2,5s · INP ≤ 200ms · CLS ≤ 0,1, no p75 de campo, em
Android intermediário. Número prometido sem medição não vale.

Toda mídia reserva dimensão (`width`/`height` ou `aspect-ratio`) — CLS
vem quase sempre de imagem sem tamanho declarado.

---

## O que este site não tem, por decisão

Não é omissão; é escolha registrada, para ninguém "corrigir" depois:

- **Sem build.** HTML, CSS e JS servidos como estão. O `site.css` é
  saída congelada do Tailwind e hoje se edita à mão: classe nova de
  utilitário não existe mais.
- **Sem requisição externa** no que é do site — fontes e bibliotecas são
  locais. As páginas de loja incorporam mapa e Instagram, e isso é a
  exceção conhecida.
- **Sem medição** (GA4, GTM, Pixel) e, por consequência, **sem cookie
  próprio**.
- **Sem carrinho, checkout ou preço.** O site é institucional: mostra a
  rede, as marcas e as unidades. A condição sai da simulação presencial.
