/**
 * Slider de banners.
 *
 * Não usa GSAP: é conteúdo, não decoração. Se a camada de movimento
 * falhar, o slider continua funcionando com transições de CSS.
 *
 * Decisões que valem explicar:
 *
 * - As artes já trazem título e CTA embutidos no próprio JPEG. Por isso
 *   NÃO existe legenda sobreposta aqui — texto sobre texto seria ilegível.
 *   O que fazemos é envolver o slide inteiro num link, para que o botão
 *   desenhado na arte finalmente clique em algum lugar.
 *
 * - A altura nunca muda porque a proporção é travada no CSS via
 *   aspect-ratio, e o processar-banners.js já entrega todos os arquivos
 *   na mesma proporção.
 *
 * - O autoplay pausa no hover, no foco do teclado e quando a aba sai de
 *   vista. Também respeita prefers-reduced-motion: com movimento reduzido
 *   ele não roda sozinho, só pelos controles (WCAG 2.2.2).
 */

(() => {
  const raiz = document.querySelector("[data-slider-banners]");
  if (!raiz) return;

  const querMovimento = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const escapar = (t) =>
    String(t ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);

  iniciar();

  async function iniciar() {
    let dados;
    try {
      const resposta = await fetch(raiz.dataset.fonte || "data/banners.json");
      if (!resposta.ok) throw new Error(`banners.json respondeu ${resposta.status}`);
      dados = await resposta.json();
    } catch (erro) {
      console.error(erro);
      raiz.remove(); // sem dados, some a seção inteira em vez de deixar um buraco
      return;
    }

    const banners = (dados.banners || []).filter((b) => b.ativo !== false);
    if (!banners.length) {
      raiz.remove();
      return;
    }

    raiz.innerHTML = montarMarcacao(banners);
    ligarControles(raiz, banners.length, Number(dados.config?.intervalo_ms) || 6500);
  }

  function montarMarcacao(banners) {
    const slides = banners.map((b, i) => slide(b, i)).join("");

    const pontos = banners
      .map(
        (b, i) => `
        <button type="button" class="ponto" data-ir="${i}"
                aria-label="Ir para o banner ${i + 1} de ${banners.length}"
                ${i === 0 ? 'aria-current="true"' : ""}></button>`
      )
      .join("");

    return `
      <div class="slider-trilho" data-trilho>
        ${slides}
      </div>

      <button type="button" class="slider-seta slider-seta-esq" data-anterior
              aria-label="Banner anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <button type="button" class="slider-seta slider-seta-dir" data-proximo
              aria-label="Próximo banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div class="slider-pontos" role="group" aria-label="Escolher banner">
        ${pontos}
      </div>`;
  }

  function slide(banner, indice) {
    const base = `assets/img/banners/${banner.arquivo}`;

    // <picture> escolhe: mobile 1:1 até 767px, depois desktop 1280 e 1920.
    // WebP primeiro, JPEG como rede de segurança.
    const figura = `
      <picture>
        <source media="(max-width: 767px)" type="image/webp"
                srcset="${base}-mobile.webp" />
        <source media="(max-width: 767px)" type="image/jpeg"
                srcset="${base}-mobile.jpg" />
        <source type="image/webp"
                srcset="${base}-desktop-1280.webp 1280w, ${base}-desktop.webp 1920w"
                sizes="100vw" />
        <img src="${base}-desktop-1280.jpg"
             srcset="${base}-desktop-1280.jpg 1280w, ${base}-desktop.jpg 1920w"
             sizes="100vw"
             alt="${escapar(banner.alt)}"
             width="1920" height="740"
             loading="${indice === 0 ? "eager" : "lazy"}"
             ${indice === 0 ? 'fetchpriority="high"' : ""}
             decoding="async"
             class="slider-img" />
      </picture>`;

    const conteudo = banner.link
      ? `<a href="${escapar(banner.link)}"
            ${banner.externo ? 'target="_blank" rel="noopener noreferrer"' : ""}
            class="slider-link"
            aria-label="${escapar(banner.rotulo_link || banner.alt)}">
           ${figura}
         </a>`
      : figura;

    return `
      <div class="slider-slide" data-slide="${indice}"
           ${indice === 0 ? "" : 'aria-hidden="true"'}
           role="group" aria-roledescription="banner"
           aria-label="${indice + 1} de {TOTAL}">
        ${conteudo}
      </div>`;
  }

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
