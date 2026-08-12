# Roteiro da experiência — "A rede HG Smart"

Documento anterior ao código, como o brief pede. Define cena a cena o que
aparece, o que se move, o que dispara o movimento e para que serve.

**Objetivo:** fortalecer a marca e mostrar o que a rede tem. Não é
vender pelo site, não é capturar lead, não é fazer o visitante escolher
um caminho. Ele assiste e entende.

**Ação esperada:** ao final, saber que a HG Smart é uma rede de dez
lojas com estrutura, marcas e condições — e ter à mão a navegação normal
para procurar o que quiser.

---

## Suposições registradas

Onde faltou informação, adotei a saída conservadora:

1. **A abertura é a home.** Se ela deve ser página separada, muda a
   arquitetura de URL e o `index.html` continua como está.
2. **Sem áudio.** O conceito citava sons de porta e interface; som que
   toca sozinho é bloqueado pelo navegador e incomoda. Se entrar, entra
   com controle visível e desligado por padrão.
3. **O Eduardo aparece uma vez, no fecho.** Ele foi criticado como
   "colado" quando estava sobre a cena. No fecho, com fundo próprio,
   funciona como assinatura humana.
4. **Nenhuma frase promete parcela** nas cenas de vídeo. Número de
   parcela vive nas páginas de pagamento, onde existe contexto e o
   cartão de pendência.

---

## Mapa da experiência

| # | Cena | Fundo | O que faz |
|---|---|---|---|
| 00 | Chegada | vídeo p1, quadro 1 | marca + tese + convite a rolar |
| 01 | Passagem: a rua | vídeo p1, scrub | entrar |
| 02 | Capítulo: A rede | sólido | provar tamanho |
| 03 | Passagem: por dentro | vídeo p2, scrub | mostrar padrão |
| 04 | Capítulo: As lojas | sólido alternado | provar estrutura |
| 05 | Passagem: o corredor | vídeo p3, scrub | chegar à marca |
| 06 | Capítulo: As marcas | sólido | provar variedade |
| 07 | Capítulo: O que fazemos | sólido alternado | provar escopo |
| 08 | Fecho | sólido + Eduardo | assinar |
| 09 | Site | — | navegação normal assume |

---

## Cena 00 — Chegada

**Aparece:** logo (topo, pequeno), título de abertura, uma linha de
apoio, indicador de rolagem. Fundo é o primeiro quadro da passagem 1,
parado, com escurecimento vindo de baixo.

**Move:** o título entra por máscara, linha a linha, `stagger` 40ms,
curva `entrada`. A linha de apoio entra 200ms depois, em fade curto. O
indicador pulsa 5px, infinito.

**Dispara:** carregamento da página.

**Para quê:** dizer em três segundos o que é a HG Smart, e sinalizar que
a página se lê rolando.

**Texto**
- Rótulo: `REDE HG SMART · RIO GRANDE DO SUL`
- Título: **Tecnologia não devia ser privilégio.**
- Apoio: Dez lojas no Rio Grande do Sul, montadas para atender quem
  outras lojas recusam.
- Indicador: `ROLE PARA CONHECER ↓`

**Mobile:** título em `d1` com teto menor; apoio some (a tese já está no
título); indicador permanece.

**Se a animação não carregar:** tudo visível, sem máscara.

---

## Cena 01 — Passagem: a rua

**Aparece:** vídeo em tela cheia. Nenhuma interface por cima além de uma
frase no rodapé.

**Move:** os quadros avançam ligados ao scroll (`scrub .6`). A frase
entra por máscara aos 15% do trecho e sai aos 75%.

**Dispara:** rolagem. **Ao voltar:** o trecho reverte — o percurso anda
para trás com o gesto, sem salto.

**Técnica:** sequência de quadros em `<canvas>`, e não `<video>` com
`currentTime`: o MP4 tem 1 keyframe por segundo e o seek fora deles
engasga, pior ainda no Safari do iOS.

**Para quê:** tirar o visitante da posição de quem lê um site e colocar
na de quem entra num lugar.

**Texto:** *Uma loja de rua, na esquina de sempre.*

**Mobile:** metade da altura de rolagem; sequência com menos quadros e
resolução menor.

---

## Cena 02 — Capítulo: A rede

**Aparece:** número `01` como marca d'água grande atrás do título;
título; parágrafo com degrau editorial; régua de números; lista das
cidades em corpo grande.

**Move:** título por máscara; parágrafo e régua em fade com deslocamento
de 24px, `stagger` 80ms; os números contam de 0 até o valor, uma vez.

**Dispara:** `ScrollTrigger` em `top 82%`. **Ao voltar:** permanece —
reanimar conteúdo já lido irrita.

**Para quê:** provar tamanho. É o argumento de solidez da marca.

**Conteúdo:** 10 lojas · 10 cidades · +1 Pelotas em breve · 5+
financeiras · as onze cidades por extenso.

**Mobile:** régua vira 2 colunas; sem degrau; contagem numérica
desligada (custa quadro em aparelho fraco e o valor final basta).

---

## Cena 03 — Passagem: por dentro

Igual à 01, com o **vídeo 2** — walkthrough interno, outro ângulo.

**Por que outro vídeo:** trechos contínuos do mesmo arquivo, separados
por um capítulo, leem como se o vídeo tivesse voltado. O fim de um e o
começo do outro são quadros quase idênticos.

**Texto:** *Por dentro, o mesmo padrão em todas.*

---

## Cena 04 — Capítulo: As lojas

**Aparece:** número `02`, título, parágrafo, faixa com as fotos reais da
matriz.

**Move:** as fotos entram em sequência, `stagger` 100ms, com parallax
moderado (12px) ligado ao scroll.

**Para quê:** provar estrutura — loja de rua, vitrine, expositor aberto,
gente atendendo.

**Pendência conhecida:** só a matriz tem foto própria. As outras nove
esperam material do marketing; até lá, a faixa mostra as quatro fotos de
Santa Cruz do Sul e o texto não afirma que representam todas.

---

## Cena 05 — Passagem: o corredor

Igual à 01, com o **vídeo 3** — chegada à parede da marca.

**Texto:** *E a marca, no fim do corredor.*

---

## Cena 06 — Capítulo: As marcas

**Aparece:** número `03`, título, parágrafo, as nove logos em faixa.

**Move:** logos entram em `stagger` 60ms. No hover, a logo sai do
cinza e ganha cor — microinteração, 200ms.

**Para quê:** provar variedade sem listar modelo nem preço.

**Mobile:** grade de 3 colunas; sem hover, todas já coloridas.

---

## Cena 07 — Capítulo: O que fazemos

**Aparece:** número `04`, título, seis linhas — celulares, condições,
acessórios, marca própria, assistência e garantia, Troop Telecom.

**Move:** cada linha entra em fade curto, `stagger` 70ms. Filete
inferior cresce da esquerda quando a linha entra.

**Para quê:** provar escopo. É aqui que aparecem películas HG Fiber,
capinhas HG Smart e a Troop — o que a rede tem além de vender aparelho.

---

## Cena 08 — Fecho

**Aparece:** frase de marca, assinatura institucional, e o Eduardo
entrando pela direita **sobre fundo sólido** — não sobre foto.

**Move:** o Eduardo entra com deslocamento de 26px e fade, 900ms. Nada
de inclinação 3D nem parallax de cursor: com recorte plano isso denuncia
a falta de volume.

**Para quê:** dar rosto à rede e fechar o arco.

**Texto:** **Tecnologia é inclusão.** / `REDE HG SMART · GRUPO HERMES ·
RIO GRANDE DO SUL`

---

## Cena 09 — O site assume

Cabeçalho compacto entra fixo quando o fecho termina, com a navegação
que já existe: Produtos · Como comprar · Lojas · Troque seu usado ·
Garantia · Ajuda. A partir daqui é o site institucional normal.

---

## Fora do trilho

- **Pular introdução:** botão discreto no canto superior direito desde a
  cena 00, que leva direto ao cabeçalho. Obrigatório quando a abertura
  ocupa a tela inteira.
- **Voltar ao topo** no rodapé.
- A experiência **não bloqueia rolagem** em nenhum ponto, não captura o
  gesto e não altera a velocidade da página.

---

## Alternativa completa (movimento reduzido / falha)

Com `prefers-reduced-motion`, sem GSAP ou com falha nas mídias:

- Trilhos zeram, passagens viram **uma imagem estática** cada.
- Todo texto entra visível, sem máscara.
- Contagem numérica mostra o valor final.
- Scroll suave desligado.
- A página continua contando a mesma história, mais curta.

---

## O que falta decidir com você

1. Isto vira a **home** ou é página à parte?
2. **10,7 MB** de quadros para as três passagens é aceitável? Cortando
   de 40 para 24 quadros por passagem cai para ~6,5 MB.
3. As nove lojas sem foto: publico a faixa só com a matriz, ou seguro a
   cena 04 até o material chegar?
