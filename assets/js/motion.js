/**
 * Camada de movimento do site institucional da Rede HG Smart.
 *
 * Princípio que rege este arquivo: o site é 100% legível sem JavaScript.
 * O CSS entrega o estado FINAL como padrão. Só depois de confirmar que o
 * visitante aceita movimento é que marcamos <html class="motion-ok">, e aí
 * o CSS esconde os elementos para que o GSAP os traga.
 *
 * Se o GSAP não carregar, nada é escondido e o conteúdo aparece inteiro.
 */

(() => {
  const raizHtml = document.documentElement;
  const querMovimento = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temGsap = typeof window.gsap !== "undefined";
  const ehTelaPequena = window.matchMedia("(max-width: 767px)").matches;

  // ─── Sem GSAP ou sem vontade de movimento: entrega estática e sai ───
  if (!temGsap || !querMovimento) {
    iniciarSemMovimento();
    return;
  }

  raizHtml.classList.add("motion-ok");

  const { gsap } = window;
  gsap.registerPlugin(window.ScrollTrigger);
  const { ScrollTrigger } = window;

  gsap.defaults({ ease: "power3.out", duration: 0.6 });

  const rolagem = iniciarRolagemSuave();
  iniciarCabecalho();
  iniciarBarraProgresso();
  revelarHero();
  revelarPorScroll();
  animarMarquees();
  animarSecaoPinada();
  animarContadores();
  animarBrilhoCartoes();
  animarLegendasBanner();

  ScrollTrigger.refresh();

  /* O site.js avisa quando terminou de injetar lojas/catálogo do JSON.
     Aqui reagimos: animamos só o que é novo e recalculamos as marcas
     do ScrollTrigger, já que a altura da página mudou. */
  document.addEventListener("hg:conteudo-injetado", (evento) => {
    const raiz = evento.detail?.raiz || document;
    revelarPorScroll(raiz);
    animarBrilhoCartoes(raiz);
    ScrollTrigger.refresh();
  });

  /* ─────────────────────────────────────────────────────────────
     Rolagem suave (Lenis) integrada ao ScrollTrigger
     ───────────────────────────────────────────────────────────── */
  function iniciarRolagemSuave() {
    if (typeof window.Lenis === "undefined" || ehTelaPequena) return null;

    const lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
    gsap.ticker.lagSmoothing(0);

    // Âncoras internas passam a usar o Lenis
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (evento) => {
        const alvo = document.querySelector(link.getAttribute("href"));
        if (!alvo) return;
        evento.preventDefault();
        lenis.scrollTo(alvo, { offset: -80 });
      });
    });

    return lenis;
  }

  /* ─────────────────────────────────────────────────────────────
     Cabeçalho: ganha fundo ao sair do topo, esconde ao descer,
     reaparece ao subir. Nunca esconde com o menu mobile aberto.
     ───────────────────────────────────────────────────────────── */
  function iniciarCabecalho() {
    const cabecalho = document.querySelector("[data-cabecalho]");
    if (!cabecalho) return;

    let ultimo = 0;

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        cabecalho.dataset.preso = y > 40 ? "true" : "false";

        const menuAberto = document.querySelector('[data-menu-mobile][data-aberto="true"]');
        const descendo = y > ultimo && y > 320;
        cabecalho.dataset.oculto = descendo && !menuAberto ? "true" : "false";
        ultimo = y;
      },
    });
  }

  /* ─── Barra de progresso da leitura ───────────────────────── */
  function iniciarBarraProgresso() {
    const barra = document.querySelector("[data-progresso]");
    if (!barra) return;

    gsap.to(barra, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  }

  /* ─────────────────────────────────────────────────────────────
     Hero: as linhas do título sobem de trás da máscara.
     Staging (princípio 3) — o título lidera, o resto segue.
     ───────────────────────────────────────────────────────────── */
  function revelarHero() {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;

    const linhas = hero.querySelectorAll(".linha-mask > span");
    const secundarios = hero.querySelectorAll("[data-hero-secundario]");
    if (!linhas.length) return;

    const linha = gsap.timeline({ delay: 0.15 });

    linha.to(linhas, {
      y: "0%",
      duration: 1.05,
      stagger: 0.085, // menor que a duração: as linhas se sobrepõem
      ease: "expo.out",
    });

    if (secundarios.length) {
      linha.to(
        secundarios,
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 },
        "-=0.62" // entra antes do título terminar — follow through
      );
    }
  }

  /* ─────────────────────────────────────────────────────────────
     Reveals genéricos por scroll.

     Idempotente: marca cada elemento com data-revelado e ignora
     quem já foi inicializado. Isso permite chamar de novo quando o
     site.js injeta lojas ou catálogo vindos do JSON — sem esse
     segundo passe, o conteúdo assíncrono ficaria invisível para
     sempre, porque o CSS o esconde e nada o traria de volta.
     ───────────────────────────────────────────────────────────── */
  function revelarPorScroll(raiz = document) {
    const novos = (seletor) =>
      gsap.utils.toArray(seletor, raiz).filter((el) => !el.dataset.revelado);

    novos("[data-reveal]").forEach((elemento) => {
      elemento.dataset.revelado = "1";
      gsap.to(elemento, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        scrollTrigger: { trigger: elemento, start: "top 86%" },
      });
    });

    /* Aqui a marca de "já revelado" vai nos FILHOS, não no grupo.

       Marcar o grupo parecia equivalente e não é: um grupo alimentado por
       JSON já existe no HTML antes do fetch, contendo só o "Carregando…".
       A primeira passada marcava o grupo e animava esse placeholder; quando
       os cards de verdade chegavam, a segunda passada descartava o grupo por
       já estar marcado — e os cards ficavam presos no `opacity:0` que o CSS
       aplica em `[data-reveal-grupo]>*`, sem nada para trazê-los de volta.

       Filtrando por filho, o placeholder é revelado na primeira passada e os
       cards na segunda, cada um uma única vez. */
    gsap.utils.toArray("[data-reveal-grupo]", raiz).forEach((grupo) => {
      const filhos = Array.from(grupo.children).filter((f) => !f.dataset.revelado);
      if (!filhos.length) return;
      filhos.forEach((f) => (f.dataset.revelado = "1"));
      const passo = filhos.length > 8 ? 0.05 : 0.08; // mais itens, passo menor

      gsap.to(filhos, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: passo,
        scrollTrigger: { trigger: grupo, start: "top 86%" },
      });
    });

    // Linhas mascaradas fora do hero
    novos("[data-reveal-linhas]").forEach((bloco) => {
      bloco.dataset.revelado = "1";
      const linhas = bloco.querySelectorAll(".linha-mask > span");
      if (!linhas.length) return;
      gsap.to(linhas, {
        y: "0%",
        duration: 0.95,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: bloco, start: "top 84%" },
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     Marquee de marcas: corre sozinho e a direção se INVERTE
     conforme o sentido do scroll — a "contra-rotação".
     ───────────────────────────────────────────────────────────── */
  function animarMarquees() {
    gsap.utils.toArray("[data-marquee]").forEach((trilha) => {
      const conteudo = trilha.querySelector(".marquee");
      if (!conteudo) return;

      // Duplica para o loop fechar sem salto
      conteudo.append(...Array.from(conteudo.children).map((n) => n.cloneNode(true)));

      const metade = () => conteudo.scrollWidth / 2;
      const paraEsquerda = trilha.dataset.marquee !== "direita";
      const base = paraEsquerda ? -1 : 1;

      const loop = gsap.to(conteudo, {
        x: paraEsquerda ? () => -metade() : 0,
        duration: Number(trilha.dataset.duracao || 26),
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (valor) => {
            const m = metade();
            return `${(parseFloat(valor) % m) - (paraEsquerda ? 0 : m)}px`;
          },
        },
      });

      if (paraEsquerda) gsap.set(conteudo, { x: 0 });

      /* Modo carrossel (`data-continuo`): o loop roda sozinho, em velocidade
         e sentido constantes, sem ouvir o scroll.

         O padrão desta função é o oposto — a faixa é "contra-rotativa": os
         dois ScrollTrigger abaixo invertem o sentido quando a página sobe e
         aceleram até 4x conforme a velocidade do scroll. Isso dá energia numa
         home, mas numa faixa de logos parece defeito: ela para, volta e
         dispara. Quem quiser o carrossel previsível marca `data-continuo` e
         sai antes de amarrar o loop ao scroll. */
      if (trilha.hasAttribute("data-continuo")) return;

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const direcao = self.direction || 1;
          // Descendo: velocidade normal. Subindo: inverte o sentido.
          loop.timeScale(base * direcao * 1);
        },
      });

      // Empurrão extra proporcional à velocidade do scroll
      ScrollTrigger.create({
        trigger: trilha,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const extra = 1 + Math.min(Math.abs(self.getVelocity() / 900), 3);
          gsap.to(loop, { timeScale: base * (self.direction || 1) * extra, duration: 0.35, overwrite: true });
        },
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     Seção pinada: a coluna de texto troca de capítulo enquanto
     o aparelho vetorial gira. Scrub numérico (1) e não booleano,
     senão o movimento fica travado.
     ───────────────────────────────────────────────────────────── */
  function animarSecaoPinada() {
    const secao = document.querySelector("[data-pinada]");
    if (!secao) return;

    const capitulos = gsap.utils.toArray("[data-capitulo]", secao);
    const aparelho = secao.querySelector("[data-aparelho]");
    const indicadores = gsap.utils.toArray("[data-indicador]", secao);
    if (!capitulos.length) return;

    const mm = gsap.matchMedia();

    // Só pina no desktop: em telas pequenas o pin briga com a barra
    // de endereço do navegador e com a altura dinâmica da viewport.
    mm.add("(min-width: 1024px)", () => {
      gsap.set(capitulos, { opacity: 0, y: 34 });
      gsap.set(capitulos[0], { opacity: 1, y: 0 });
      if (indicadores[0]) indicadores[0].dataset.ativo = "true";

      const linha = gsap.timeline({
        scrollTrigger: {
          trigger: secao,
          start: "top top",
          end: () => `+=${capitulos.length * 90}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      capitulos.forEach((capitulo, i) => {
        if (i === 0) return;

        linha
          .to(capitulos[i - 1], { opacity: 0, y: -30, duration: 0.34 })
          .to(capitulo, { opacity: 1, y: 0, duration: 0.34 }, "<0.14")
          .add(() => {
            indicadores.forEach((ind, j) => {
              ind.dataset.ativo = j === i ? "true" : "false";
            });
          }, "<");
      });

      if (aparelho) {
        gsap.to(aparelho, {
          rotateY: 180,
          rotateX: -6,
          ease: "none",
          scrollTrigger: {
            trigger: secao,
            start: "top top",
            end: () => `+=${capitulos.length * 90}%`,
            scrub: 1,
          },
        });
      }

      return () => {
        gsap.set(capitulos, { clearProps: "all" });
      };
    });

    // Mobile: sem pin, cada capítulo revela no seu lugar
    mm.add("(max-width: 1023px)", () => {
      capitulos.forEach((capitulo) => {
        gsap.set(capitulo, { opacity: 0, y: 26 });
        gsap.to(capitulo, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: { trigger: capitulo, start: "top 85%" },
        });
      });
      return () => gsap.set(capitulos, { clearProps: "all" });
    });
  }

  /* ─────────────────────────────────────────────────────────────
     Contadores. snap:1 para nunca exibir número quebrado.
     ───────────────────────────────────────────────────────────── */
  function animarContadores() {
    gsap.utils.toArray("[data-contador]").forEach((elemento) => {
      const destino = Number(elemento.dataset.contador);
      if (Number.isNaN(destino)) return;

      const sufixo = elemento.dataset.sufixo || "";
      const estado = { valor: 0 };

      gsap.to(estado, {
        valor: destino,
        duration: destino > 500 ? 2 : 1.3, // magnitude define a duração
        ease: "power2.out",
        snap: { valor: 1 },
        onUpdate: () => {
          elemento.textContent = Math.round(estado.valor).toLocaleString("pt-BR") + sufixo;
        },
        scrollTrigger: { trigger: elemento, start: "top 88%" },
      });
    });
  }

  /* ─── Brilho que segue o cursor nos cartões ───────────────── */
  function animarBrilhoCartoes(raiz = document) {
    if (window.matchMedia("(hover: none)").matches) return;

    raiz.querySelectorAll(".cartao:not([data-brilho])").forEach((cartao) => {
      cartao.dataset.brilho = "1";
      cartao.addEventListener("pointermove", (evento) => {
        const caixa = cartao.getBoundingClientRect();
        cartao.style.setProperty("--mx", `${evento.clientX - caixa.left}px`);
        cartao.style.setProperty("--my", `${evento.clientY - caixa.top}px`);
      });
    });
  }

  /* ─── Legenda do banner entra por máscara + parallax leve ─── */
  function animarLegendasBanner() {
    gsap.utils.toArray("[data-banner]").forEach((banner) => {
      const legenda = banner.querySelectorAll("[data-banner-legenda] .linha-mask > span");
      const fundo = banner.querySelector("[data-banner-fundo]");

      if (legenda.length) {
        gsap.to(legenda, {
          y: "0%",
          duration: 1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: banner, start: "top 72%" },
        });
      }

      // Parallax reduzido no mobile (bateria e GPU)
      if (fundo) {
        gsap.fromTo(
          fundo,
          { yPercent: ehTelaPequena ? -4 : -10 },
          {
            yPercent: ehTelaPequena ? 4 : 10,
            ease: "none",
            scrollTrigger: { trigger: banner, start: "top bottom", end: "bottom top", scrub: 1 },
          }
        );
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────
     Caminho sem movimento: garante que nada fique escondido.
     ───────────────────────────────────────────────────────────── */
  function iniciarSemMovimento() {
    raizHtml.classList.remove("motion-ok");

    // Contadores mostram o valor final direto
    document.querySelectorAll("[data-contador]").forEach((elemento) => {
      const destino = Number(elemento.dataset.contador);
      if (Number.isNaN(destino)) return;
      elemento.textContent = destino.toLocaleString("pt-BR") + (elemento.dataset.sufixo || "");
    });

    // Cabeçalho ainda ganha fundo ao rolar — é orientação, não enfeite
    const cabecalho = document.querySelector("[data-cabecalho]");
    if (cabecalho) {
      const aoRolar = () => {
        cabecalho.dataset.preso = window.scrollY > 40 ? "true" : "false";
      };
      window.addEventListener("scroll", aoRolar, { passive: true });
      aoRolar();
    }

    // Primeiro capítulo visível; os demais empilham normalmente
    document.querySelectorAll("[data-indicador]").forEach((ind, i) => {
      ind.dataset.ativo = i === 0 ? "true" : "false";
    });
  }
})();
