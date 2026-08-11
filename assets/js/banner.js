/**
 * Slider de banners.
 *
 * Não usa GSAP: é conteúdo, não decoração. Se a camada de movimento
 * falhar, o slider continua funcionando com transições de CSS.
 *
 * ─── O QUE SAIU DAQUI ───
 * Este arquivo buscava data/banners.json com fetch() e montava os slides
 * em tempo de visita. O markup dos slides agora está escrito no
 * index.html, e o que sobrou aqui é só o COMPORTAMENTO: avançar, voltar,
 * autoplay e os pontos de navegação.
 *
 * O ganho prático: os banners aparecem mesmo antes do JS rodar, e o
 * `raiz.remove()` que existia no catch do fetch — que apagava a seção
 * inteira quando o JSON não vinha — deixou de existir junto.
 *
 * Decisões que valem explicar:
 *
 * - As artes já trazem título e CTA embutidos no próprio JPEG. Por isso
 *   NÃO existe legenda sobreposta aqui — texto sobre texto seria ilegível.
 *   O que fazemos é envolver o slide inteiro num link, para que o botão
 *   desenhado na arte finalmente clique em algum lugar.
 *
 * - A altura nunca muda porque a proporção é travada no CSS via
 *   aspect-ratio, e as artes são todas entregues na mesma proporção.
 *
 * - O autoplay pausa no hover, no foco do teclado e quando a aba sai de
 *   vista. Também respeita prefers-reduced-motion: com movimento reduzido
 *   ele não roda sozinho, só pelos controles (WCAG 2.2.2).
 */

(() => {
  const raiz = document.querySelector("[data-slider-banners]");
  if (!raiz) return;

  /* O total sai do DOM, não de um JSON: os slides já estão na página.
     Sem slide nenhum não há o que controlar — e a seção fica como está,
     em vez de sumir. */
  const total = raiz.querySelectorAll("[data-slide]").length;
  if (!total) return;

  const querMovimento = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Intervalo do autoplay, em ms. Era `config.intervalo_ms` do
     banners.json; agora é atributo no HTML, com o mesmo padrão. */
  const intervalo = Number(raiz.dataset.intervalo) || 6500;

  ligarControles(raiz, total, intervalo);

  function ligarControles(raiz, total, intervalo) {
    // Corrige o placeholder do rótulo agora que sabemos o total
    raiz.querySelectorAll("[data-slide]").forEach((el) => {
      el.setAttribute("aria-label", el.getAttribute("aria-label").replace("{TOTAL}", total));
    });

    const slides = [...raiz.querySelectorAll("[data-slide]")];
    const pontos = [...raiz.querySelectorAll("[data-ir]")];
    let atual = 0;
    let cronometro = null;

    const mostrar = (indice) => {
      atual = (indice + total) % total;

      slides.forEach((slide, i) => {
        const ativo = i === atual;
        slide.dataset.ativo = ativo ? "true" : "false";
        // aria-hidden evita o leitor de tela anunciar os slides fora de vista
        if (ativo) slide.removeAttribute("aria-hidden");
        else slide.setAttribute("aria-hidden", "true");
        // tira do caminho do teclado o link de um slide invisível
        const link = slide.querySelector("a");
        if (link) link.tabIndex = ativo ? 0 : -1;
      });

      pontos.forEach((ponto, i) => {
        if (i === atual) ponto.setAttribute("aria-current", "true");
        else ponto.removeAttribute("aria-current");
      });
    };

    const rearmar = () => {
      clearInterval(cronometro);
      // Com movimento reduzido não roda sozinho — só pelos controles
      if (!querMovimento) return;
      cronometro = setInterval(() => mostrar(atual + 1), intervalo);
    };

    raiz.querySelector("[data-proximo]").addEventListener("click", () => {
      mostrar(atual + 1);
      rearmar();
    });

    raiz.querySelector("[data-anterior]").addEventListener("click", () => {
      mostrar(atual - 1);
      rearmar();
    });

    pontos.forEach((ponto) => {
      ponto.addEventListener("click", () => {
        mostrar(Number(ponto.dataset.ir));
        rearmar();
      });
    });

    // Teclado: setas navegam quando o foco está dentro do slider
    raiz.addEventListener("keydown", (evento) => {
      if (evento.key === "ArrowRight") {
        mostrar(atual + 1);
        rearmar();
      } else if (evento.key === "ArrowLeft") {
        mostrar(atual - 1);
        rearmar();
      }
    });

    // Pausa: hover, foco e aba em segundo plano
    raiz.addEventListener("pointerenter", () => clearInterval(cronometro));
    raiz.addEventListener("pointerleave", rearmar);
    raiz.addEventListener("focusin", () => clearInterval(cronometro));
    raiz.addEventListener("focusout", rearmar);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearInterval(cronometro);
      else rearmar();
    });

    // Arraste horizontal no toque
    let inicioX = null;
    raiz.addEventListener("pointerdown", (e) => { inicioX = e.clientX; });
    raiz.addEventListener("pointerup", (e) => {
      if (inicioX === null) return;
      const delta = e.clientX - inicioX;
      if (Math.abs(delta) > 45) {
        mostrar(atual + (delta < 0 ? 1 : -1));
        rearmar();
      }
      inicioX = null;
    });

    mostrar(0);
    rearmar();
  }
})();
