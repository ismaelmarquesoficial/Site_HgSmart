# Sistema de design · Rede HG Smart

A marca em uma frase: **preto profundo, um único azul, títulos condensados.**

Esta pasta é a referência do site novo. As regras continuam no `DESIGN.md`, na raiz; aqui está o que foi construído a partir delas.

| Arquivo | O que é |
|---|---|
| `index.html` | Referência viva: cores, tipografia, espaço, componentes e movimento, com as peças reais do site. Abra por um servidor local (`python3 -m http.server` na raiz) em `/design-system/`. |
| `tokens.css` | Só o bloco `:root`, para usar os tokens em outra peça (landing, e-mail, banner em HTML). |
| `tokens.json` | Os mesmos tokens com valor, uso e contraste, para ferramentas. |

`index.html`, `tokens.css` e `tokens.json` são gerados por `ferramentas/gerador-site` a partir de `assets/css/hg.css`. Não edite à mão: mude o CSS ou as notas em `ferramentas/gerador-site/sistema.py` e rode o gerador.

## Cor

- O site é escuro por padrão: `--fundo`, com `--fundo-2` nas seções alternadas e nos cartões, e `--fundo-3` no rodapé, no menu e nas legendas.
- Texto em três níveis: `--tinta`, `--tinta-2` e `--tinta-3`.
- `--acao` (#00a2c7) é o único acento: botão principal, foco, numerais e o filete sob os títulos. É acento, não superfície de seção.
- Sobre `--acao` o texto é `--acao-tinta`, nunca branco.
- Seções claras (`.clara`) usam `--papel` e a família `--papel-*`. Sobre branco, `--acao` tem só 3,0:1; por isso texto pequeno usa `--papel-acao` e título grande usa `--papel-acao-display`.
- Verde (`--ok`, `--zap`) e amarelo (`--estrela`) são estados de sistema e não entram na composição.

## Tipografia

- Duas famílias: Bebas Neue 400 (`--display`) e Inter variável (`--corpo`), servidas de `assets/fontes/`.
- Bebas nunca recebe `text-transform`: a caixa alta é da própria fonte.
- Escala: `--d1`, `--d2`, `--d3` para títulos; `--t1`, `--t2`, `--t3` para texto; `--r1` para rótulo.
- Numerais são ornamento: `--dado`, `--dado-2` e `--fantasma`.
- Parágrafo com no máximo 58 caracteres por linha.

## Espaço e forma

- Escala de espaço, em rem: 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 12.
- Grade de 12 colunas, vão de 1.5rem, largura máxima de 90rem. Respiro de seção em `--secao`, margem lateral em `--lado`.
- Cartão: sólido em `--fundo-2`, borda de 1px em `--linha`, raio de 1rem. Sem sombra colorida e sem borda em degradê.
- Botão, chip, etiqueta e filtro são pílula, com alvo mínimo de 44px.
- Nada de vidro (`backdrop-filter`) sobre foto: legenda e cartão sobre imagem são sólidos.

## Movimento

- O conteúdo está no HTML. Sem JavaScript, ou com `prefers-reduced-motion`, a página aparece inteira e parada.
- Nada segura o visitante parado. Não há seção presa à tela.
- Três animações de texto: máscara por linha, fade curto e contagem uma vez por página.
- Anima-se `transform` e `opacity`; recorte (`clip-path`) entra nas fotos.
- Rolagem com inércia de .6. A abertura aparece uma vez por sessão.

## Conteúdo

- Português do Brasil, direto e concreto. Títulos curtos, em até três linhas.
- O dado é o ornamento: 10 lojas, 18x, 24x, 44x e os nomes das cidades em corpo grande.
- O que não se sabe não se publica. Onde falta um dado entra o cartão de pendência (`.pend`), visível, com o código da pendência.
- O site é institucional: sem preço, sem carrinho.

## O que este redesenho acrescentou ao `DESIGN.md`

Estes pontos não estavam no documento e precisam da sua aprovação para entrarem nele:

- `--d4`, um degrau de título abaixo de `--d3`, para listas densas (cidade, pergunta do FAQ, linha de tabela).
- `--dado-2`, numeral médio, usado nos números da rede e nos cartões de forma de pagamento.
- A família `--papel-*`, que dá nome às cores das seções claras que o site já tinha.
- `--zap-tinta` escuro: o texto do botão de WhatsApp passou de branco para quase preto, porque branco sobre o verde ficava em 2,9:1.
- O título da marca no rodapé (`.rodape-marca`) tem tamanho próprio, fora da escala, porque acompanha a largura da tela.
