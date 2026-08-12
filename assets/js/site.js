/**
 * Comportamento não-decorativo do site: menu mobile, ano do rodapé e o
 * movimento contínuo da faixa de depoimentos.
 *
 * ─── O QUE SAIU DAQUI ───
 * Este arquivo montava, em tempo de visita, os cartões de loja, as
 * marcas do catálogo, os acessórios e os depoimentos — buscando
 * data/*.json com fetch(). Todo esse conteúdo agora está escrito
 * direto no HTML.
 *
 * Três coisas melhoraram de uma vez:
 *   - a página não depende mais de JavaScript para ser LIDA (era o que
 *     o README já prometia, e não era verdade nessas seções);
 *   - o buscador enxerga o conteúdo sem precisar executar script;
 *   - o site abre com duplo clique, porque não há mais fetch — que o
 *     navegador bloqueia em file:// e obrigava a subir um servidor.
 *
 * Em troca, editar uma loja passou a ser editar o HTML das páginas onde
 * ela aparece. É o custo consciente de não ter etapa de geração.
 *
 * Nada aqui depende do GSAP. Se motion.js falhar, isto continua.
 */

(() => {
  iniciarMenuMobile();
  preencherAno();

  document.addEventListener("DOMContentLoaded", () => {
    const faixa = document.querySelector("[data-depoimentos]");
    if (faixa) animarDepoimentos(faixa);
  });

  /* ─────────────────────────────────────────────────────────────
     Menu mobile. Trava o scroll do body e devolve o foco ao
     botão ao fechar — sem isso o teclado se perde na página.
     ───────────────────────────────────────────────────────────── */
  function iniciarMenuMobile() {
    const botao = document.querySelector("[data-menu-botao]");
    const menu = document.querySelector("[data-menu-mobile]");
    if (!botao || !menu) return;

    const alternar = (abrir) => {
      menu.dataset.aberto = abrir ? "true" : "false";
      botao.setAttribute("aria-expanded", abrir ? "true" : "false");
      botao.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
      document.body.style.overflow = abrir ? "hidden" : "";
    };

    botao.addEventListener("click", () => {
      alternar(menu.dataset.aberto !== "true");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => alternar(false));
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && menu.dataset.aberto === "true") {
        alternar(false);
        botao.focus();
      }
    });
  }

  function preencherAno() {
    document.querySelectorAll("[data-ano]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }


  /* Duas constantes que a faixa de depoimentos usa. Elas viviam fora da
     função e se perderam quando este arquivo foi enxugado — o console
     acusava "DURACAO_VOLTA is not defined" a cada quadro da animação.

     A velocidade não é fixa em pixels por segundo: sai daqui dividida
     pelo comprimento do ciclo, então se ajusta sozinha a cada breakpoint.
     No celular o ciclo é mais curto e o movimento fica proporcionalmente
     mais lento, mantendo a sensação de leitura. */
  const DURACAO_VOLTA = 40000;

  /* Depois de arrastar, a rolagem por inércia continua sozinha por um
     tempo. Retomar no `pointerup` faria o laço disputar com ela. */
  const ESPERA_APOS_ARRASTO = 700;

  /* ─────────────────────────────────────────────────────────────
     Faixa de depoimentos: rolagem horizontal nativa com scroll-snap,
     e um movimento contínuo por cima. Arrastar com o dedo, rolar no
     trackpad e navegar pelo teclado saem de graça do scroll nativo —
     o JS só cuida do movimento automático e da emenda invisível.
     ───────────────────────────────────────────────────────────── */
  function animarDepoimentos(container) {
    const originais = Array.from(container.children);
    if (originais.length < 2) return;

    const querMovimento = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Sem movimento contínuo não há emenda a esconder, e clonar 20 cards
       apenas para deixá-los parados seria peso morto no DOM. Quem pediu
       movimento reduzido fica com a faixa estática, ainda arrastável. */
    if (!querMovimento) return;

    /* Nada a rolar: a faixa inteira já cabe na tela. */
    if (container.scrollWidth <= container.clientWidth + 4) return;

    /* A cópia é decorativa: aria-hidden evita que o leitor de tela leia os
       20 depoimentos duas vezes. */
    const clones = originais.map((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      /* O clone herda o tabindex do original, e elemento focável marcado
         com aria-hidden é armadilha: o teclado pousa nele e o leitor de
         tela não anuncia nada. Tirar do fluxo de tabulação resolve. */
      clone.setAttribute("tabindex", "-1");
      return clone;
    });
    clones.forEach((clone) => container.append(clone));

    /* Um ciclo = distância do primeiro original ao seu clone. Medir assim,
       e não por scrollWidth/2, é exato: entre os dois blocos existe um gap
       que a divisão pela metade não contabiliza, e o erro acumularia até a
       emenda ficar visível. */
    const periodo = () => clones[0].offsetLeft - originais[0].offsetLeft;

    /* A posição é guardada aqui, em ponto flutuante, e só depois escrita no
       scrollLeft. Acumular direto no scrollLeft perderia a fração a cada
       quadro em navegadores que arredondam, e o movimento sairia trêmulo. */
    let posicao = container.scrollLeft;
    let ultimoQuadro = null;
    let laco = null;
    let retomada = null;

    const quadro = (agora) => {
      if (ultimoQuadro !== null) {
        const ciclo = periodo();
        // Avanço proporcional ao tempo decorrido, não ao número de quadros:
        // assim a velocidade não muda entre uma tela de 60Hz e uma de 120Hz.
        posicao += (ciclo / DURACAO_VOLTA) * (agora - ultimoQuadro);
        // A emenda: recua um ciclo inteiro sobre conteúdo idêntico.
        if (posicao >= ciclo) posicao -= ciclo;
        container.scrollLeft = posicao;
      }
      ultimoQuadro = agora;
      laco = requestAnimationFrame(quadro);
    };

    const iniciar = () => {
      if (laco) return;
      /* Retoma exatamente de onde está. Se o dedo arrastou, `posicao` está
         defasada em relação ao scroll real — daí ler o scrollLeft de volta.
         E zerar `ultimoQuadro` descarta o tempo em que ficou parado; sem
         isso, o primeiro quadro receberia um delta enorme e daria um salto. */
      posicao = container.scrollLeft;
      ultimoQuadro = null;
      laco = requestAnimationFrame(quadro);
    };

    const parar = () => {
      if (laco) cancelAnimationFrame(laco);
      laco = null;
      clearTimeout(retomada);
      retomada = null;
    };

    const retomarDepois = (ms) => {
      clearTimeout(retomada);
      retomada = setTimeout(iniciar, ms);
    };

    // Ler exige tempo: o mouse por cima segura a esteira, e sair retoma.
    container.addEventListener("mouseenter", parar);
    container.addEventListener("mouseleave", iniciar);

    /* Toque: para enquanto o dedo está na tela e volta depois que a inércia
       do arrasto se esgota. `pointercancel` cobre o gesto que vira rolagem
       vertical da página — ele dispara cancel e nunca pointerup, e sem
       tratá-lo a esteira ficaria parada para sempre. */
    container.addEventListener("pointerdown", parar);
    container.addEventListener("pointerup", () => retomarDepois(ESPERA_APOS_ARRASTO));
    container.addEventListener("pointercancel", () => retomarDepois(ESPERA_APOS_ARRASTO));

    /* Foco pelo teclado também pausa. Com as setas removidas, é o que
       garante a exigência da WCAG 2.2.2 de haver um jeito de deter
       conteúdo que se move sozinho. */
    container.addEventListener("focusin", parar);
    container.addEventListener("focusout", iniciar);

    /* Fora da tela, não anda: evita gastar CPU rodando no rodapé enquanto
       o visitante lê o topo da página. */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entradas) => (entradas[0].isIntersecting ? iniciar() : parar()),
        { threshold: 0.25 }
      ).observe(container);
    } else {
      iniciar();
    }
  }
})();
