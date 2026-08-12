/**
 * A experiência da home — passagens de vídeo e revelação dos capítulos.
 *
 * Segue o mapa de movimento do DESIGN.md:
 *   · anima só transform e opacity
 *   · scrub sempre com inércia
 *   · nada roda fora da tela
 *   · prefers-reduced-motion desliga tudo, inclusive o scroll suave
 *
 * Depende de GSAP, ScrollTrigger e Lenis — os três servidos de
 * assets/vendor/. Se algum faltar, a página continua legível: o conteúdo
 * está no HTML e o CSS entrega o estado final.
 */

(() => {
  const exp = document.querySelector('.exp');
  if (!exp) return;

  const querMovimento = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ehMobile = matchMedia('(max-width: 860px)').matches;
  const temGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  /* Sem animação: o CSS já mostra tudo. Sair cedo evita registrar
     listeners que nunca serão úteis. */
  if (!temGsap || !querMovimento) {
    exp.querySelectorAll('[data-entra]').forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    desenharPrimeiroQuadroDeCada();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ─── Scroll suave ───────────────────────────────────────────────────
     O ticker do GSAP conduz o Lenis. Cada um com o seu
     requestAnimationFrame briga pelo mesmo quadro, e o scrub treme. */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    /* duration 0.9 e não 1.05: acima disso a página responde devagar ao
       gesto e dá a sensação de que o scroll "não obedece". */
    lenis = new Lenis({ duration: .9, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    /* Com o Lenis ativo, âncora nativa e window.scrollTo são ignorados —
       a rolagem fica "presa". Todo link interno passa a usar o scrollTo
       dele, que é quem controla a posição de verdade. */
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (ev) => {
        const alvo = document.querySelector(link.getAttribute('href'));
        if (!alvo) return;
        ev.preventDefault();
        lenis.scrollTo(alvo, { offset: -8, duration: 1.1 });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     PASSAGENS
     Cada uma tem a SUA sequência, de um vídeo diferente. Trechos
     contínuos do mesmo arquivo, separados por um capítulo, leem como se
     o vídeo tivesse voltado — o fim de um e o começo do outro são
     quadros quase idênticos.
     ═══════════════════════════════════════════════════════════════════ */
  const cache = new Map();
  const chave = (pasta, i) => `${pasta}/${i}`;

  function carregar(pasta, i) {
    const k = chave(pasta, i);
    if (cache.has(k)) return cache.get(k);
    const img = new Image();
    img.decoding = 'async';
    img.src = `assets/img/entrada/${pasta}/f${String(i).padStart(3, '0')}.webp`;
    cache.set(k, img);
    return img;
  }

  function montarPassagem(secao) {
    const canvas = secao.querySelector('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const pasta = secao.dataset.pasta;
    const total = +secao.dataset.total;
    let atual = 1;

    /* "cover" na mão: o canvas tem resolução própria, então esticar o
       bitmap pelo CSS borraria. */
    /* Quadro mais próximo JÁ CARREGADO. Sem isto, `desenhar` simplesmente
       não pintava quando o quadro pedido ainda estava baixando — e o
       canvas ficava PRETO. Numa sequência de 11 MB isso acontece o tempo
       todo: quem rola antes do carregamento terminar vê tela vazia e
       conclui, com razão, que o site travou. */
    const disponivel = (alvo) => {
      const pronto = (i) => {
        const img = cache.get(chave(pasta, i));
        return img?.complete && img.naturalWidth ? img : null;
      };
      if (pronto(alvo)) return alvo;
      for (let d = 1; d < total; d++) {
        if (alvo - d >= 1 && pronto(alvo - d)) return alvo - d;
        if (alvo + d <= total && pronto(alvo + d)) return alvo + d;
      }
      return null;
    };

    const desenhar = (i) => {
      const usar = disponivel(i);
      if (usar === null) return;          /* nada carregou ainda: mantém o que está pintado */
      const img = cache.get(chave(pasta, usar));
      const e = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * e;
      const h = img.naturalHeight * e;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };

    const medir = () => {
      /* Teto de 2 no devicePixelRatio: acima disso o ganho visual some e
         o custo de preenchimento cresce ao quadrado. */
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      desenhar(atual);
    };

    /* Cada quadro que termina de baixar repinta a tela se ela ainda
       estiver mostrando um vizinho — assim a imagem vai ficando correta
       durante o carregamento, em vez de esperar tudo. */
    const primeiro = carregar(pasta, 1);
    primeiro.onload = medir;
    if (primeiro.complete) medir();
    medir();
    addEventListener('resize', medir, { passive: true });

    /* Os demais quadros só baixam quando a passagem se aproxima: com três
       sequências, carregar tudo de uma vez disputa banda com o que está
       sendo visto agora. */
    new IntersectionObserver((entradas, obs) => {
      if (!entradas[0].isIntersecting) return;
      for (let i = 1; i <= total; i++) {
        const img = carregar(pasta, i);
        img.addEventListener('load', () => { if (i === atual) desenhar(atual); }, { once: true });
      }
      obs.disconnect();
    }, { rootMargin: '150% 0px' }).observe(secao);

    const estado = { q: 1 };
    const linha = gsap.timeline({
      scrollTrigger: { trigger: secao, start: 'top top', end: 'bottom bottom', scrub: .6 },
    });

    linha.to(estado, {
      q: total, ease: 'none',
      onUpdate: () => {
        const i = Math.round(estado.q);
        if (i !== atual) { atual = i; desenhar(i); }
      },
    }, 0);

    /* A frase entra e sai dentro do trecho — ela acompanha a passagem,
       não fica pendurada nela. */
    const frase = secao.querySelector('.passagem-frase');
    if (frase) {
      const linhas = frase.querySelectorAll('.masc > span');
      linha.set(frase, { opacity: 1 }, .1);
      linha.fromTo(linhas, { yPercent: 112 },
        { yPercent: 0, duration: .16, stagger: .03, ease: 'power3.out' }, .1);
      linha.to(linhas, { yPercent: -112, duration: .12, stagger: .02, ease: 'power2.in' }, .68);
      linha.set(frase, { opacity: 0 }, .84);
    }
  }

  function desenharPrimeiroQuadroDeCada() {
    document.querySelectorAll('[data-passagem]').forEach((s) => {
      const c = s.querySelector('canvas');
      if (!c) return;
      const ctx = c.getContext('2d', { alpha: false });
      const dpr = Math.min(devicePixelRatio || 1, 2);
      c.width = Math.round(innerWidth * dpr);
      c.height = Math.round((c.clientHeight || innerHeight) * dpr);
      const img = carregar(s.dataset.pasta, 1);
      const pinta = () => {
        const e = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
        ctx.drawImage(img, (c.width - img.naturalWidth * e) / 2,
                      (c.height - img.naturalHeight * e) / 2,
                      img.naturalWidth * e, img.naturalHeight * e);
      };
      img.complete && img.naturalWidth ? pinta() : (img.onload = pinta);
    });
  }

  document.querySelectorAll('[data-passagem]').forEach(montarPassagem);

  /* ═══════════════════════════════════════════════════════════════════
     TEXTO
     Dois padrões, os mesmos do DESIGN.md: máscara por linha para título,
     fade com deslocamento curto para o resto. Nada de letra por letra
     (ilegível em corpo grande) nem blur (custa GPU e parece defeito).
     ═══════════════════════════════════════════════════════════════════ */
  exp.querySelectorAll('[data-mascara]').forEach((bloco) => {
    const linhas = bloco.querySelectorAll('.masc > span');
    gsap.fromTo(linhas,
      { yPercent: 112 },
      {
        yPercent: 0, duration: .9, ease: 'power3.out', stagger: .04,
        scrollTrigger: { trigger: bloco, start: 'top 84%' },
      });
  });

  exp.querySelectorAll('[data-entra]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: .9, ease: 'power3.out',
      delay: +(el.dataset.atraso || 0),
      scrollTrigger: { trigger: el, start: 'top 86%' },
    });
  });

  /* Contagem dos números da rede — uma vez, e só no desktop: em aparelho
     fraco ela custa quadro e o valor final já diz o que precisa. */
  if (!ehMobile) {
    exp.querySelectorAll('[data-conta]').forEach((el) => {
      const alvo = +el.dataset.conta;
      const prefixo = el.dataset.prefixo || '';
      const obj = { v: 0 };
      gsap.to(obj, {
        v: alvo, duration: 1.4, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
        onUpdate: () => { el.textContent = prefixo + Math.round(obj.v); },
      });
    });
  }

  /* O Eduardo entra no fecho, sobre fundo sólido. Sem inclinação 3D e sem
     parallax de cursor: com recorte plano, os dois denunciam que não há
     volume — foi o que fez ele parecer adesivo na tentativa anterior. */
  const eduardo = exp.querySelector('.eduardo-fecho');
  if (eduardo) {
    gsap.fromTo(eduardo,
      { opacity: 0, xPercent: 14 },
      {
        opacity: 1, xPercent: 0, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: eduardo.closest('section'), start: 'top 62%' },
      });
  }

  /* Parallax moderado nas fotos — 12px, o suficiente para dar camada sem
     descolar a imagem do texto. */
  exp.querySelectorAll('[data-parallax]').forEach((el) => {
    gsap.fromTo(el, { y: 12 }, {
      y: -12, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: .5 },
    });
  });
})();
