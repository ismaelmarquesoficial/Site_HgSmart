/**
 * "Entre na HG" — abertura conduzida pelo scroll.
 *
 * A câmera do vídeo da loja avança conforme a rolagem, frases nascem em
 * pontos do cenário e, no ponto final, a loja vira menu.
 *
 * ─── POR QUE SEQUÊNCIA DE IMAGENS E NÃO <video> ───
 * Amarrar `video.currentTime` ao scroll parece o caminho óbvio e não é. O
 * MP4 de origem tem 1 keyframe por segundo: fora deles o navegador precisa
 * decodificar desde o keyframe anterior, e o scrub engasga. No Safari do
 * iOS o seek durante o gesto de rolagem é pior ainda.
 *
 * Desenhar quadros num <canvas> é a técnica que a Apple usa nas páginas de
 * produto: cada posição de scroll tem um quadro exato, e o custo por
 * quadro é um drawImage. Em troca, os quadros precisam ser pré-carregados —
 * é o que preloadProgressivo() faz.
 *
 * Depende de GSAP + ScrollTrigger, servidos de assets/vendor/.
 */

(() => {
  const palco = document.querySelector('[data-entrada]');
  if (!palco) return;

  const canvas = palco.querySelector('[data-canvas]');
  const ctx = canvas.getContext('2d', { alpha: false });

  const querMovimento = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ehMobile = window.matchMedia('(max-width: 860px)').matches;

  /* Duas sequências: a do celular tem menos da metade dos quadros e resolução
     menor. Não é só peso — é bateria e memória de decodificação. */
  const CONF = ehMobile
    ? { pasta: 'assets/img/entrada/mobile', total: 43, largura: 640 }
    : { pasta: 'assets/img/entrada/desktop', total: 100, largura: 900 };

  const caminhoDoQuadro = (i) =>
    `${CONF.pasta}/f${String(i).padStart(3, '0')}.webp`;

  const quadros = new Array(CONF.total + 1);
  let quadroAtual = 1;
  let prontos = 0;

  /* ─── Desenho ─────────────────────────────────────────────────────────
     "cover" na mão: o canvas ocupa a tela inteira e a imagem é recortada
     pelo lado que sobra, como object-fit: cover faria. Fazer no CSS não
     serviria — o canvas tem resolução própria, e esticar o bitmap borraria. */
  function desenhar(indice) {
    const img = quadros[indice];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const escala = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * escala;
    const h = img.naturalHeight * escala;

    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  function dimensionar() {
    /* Limite de 2 no devicePixelRatio: acima disso o ganho visual some e o
       custo de preenchimento cresce ao quadrado — em telas 3x isso derruba
       o frame rate em aparelho médio. */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    desenhar(quadroAtual);
  }

  /* ─── Carregamento ────────────────────────────────────────────────────
     O primeiro quadro entra sozinho e é desenhado assim que chega: é ele
     que o visitante vê antes de qualquer coisa. Os demais vêm depois, em
     lotes pequenos, para não disputar banda com o primeiro. */
  function carregar(indice) {
    return new Promise((resolve) => {
      if (quadros[indice]) return resolve(quadros[indice]);
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => { prontos++; resolve(img); };
      img.src = caminhoDoQuadro(indice);
      quadros[indice] = img;
    });
  }

  async function preloadProgressivo() {
    await carregar(1);
    desenhar(1);

    /* Ordem de prioridade: primeiro um quadro a cada 10, para que qualquer
       posição de scroll já tenha algo perto para mostrar; depois o resto.
       Rolar rápido antes do fim do carregamento mostra o quadro mais
       próximo em vez de tela preta. */
    const grosso = [];
    for (let i = 1; i <= CONF.total; i += 10) grosso.push(i);
    const resto = [];
    for (let i = 1; i <= CONF.total; i++) if (!grosso.includes(i)) resto.push(i);

    for (const lote of [grosso, resto]) {
      for (let i = 0; i < lote.length; i += 6) {
        await Promise.all(lote.slice(i, i + 6).map(carregar));
      }
    }
  }

  /* Quadro mais próximo já carregado — evita buraco durante o preload. */
  function quadroDisponivel(alvo) {
    if (quadros[alvo]?.complete && quadros[alvo].naturalWidth) return alvo;
    for (let d = 1; d < CONF.total; d++) {
      const antes = alvo - d, depois = alvo + d;
      if (antes >= 1 && quadros[antes]?.complete && quadros[antes].naturalWidth) return antes;
      if (depois <= CONF.total && quadros[depois]?.complete && quadros[depois].naturalWidth) return depois;
    }
    return 1;
  }

  dimensionar();
  window.addEventListener('resize', dimensionar, { passive: true });
  preloadProgressivo();

  /* ─── Sem GSAP ou com movimento reduzido ──────────────────────────────
     A página não pode depender da animação para funcionar. Sem ela, a cena
     é uma imagem e o menu já está visível — o CSS cuida disso. */
  const temGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (!temGsap || !querMovimento) {
    palco.querySelector('[data-menu]')?.setAttribute('data-aberto', 'true');
    apresentarEduardo(true);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const veu = palco.querySelector('[data-veu]');
  const abertura = palco.querySelector('[data-abertura]');
  const menu = palco.querySelector('[data-menu]');
  const barra = document.querySelector('[data-barra]');
  const frases = [...palco.querySelectorAll('[data-frase]')];

  /* ─── Percurso ────────────────────────────────────────────────────────
     O scrub anima um objeto com o número do quadro. Cada atualização
     desenha — nunca mais de um desenho por frame de tela, porque o
     onUpdate do GSAP roda no ticker. */
  const estado = { quadro: 1 };

  const linhaDoTempo = gsap.timeline({
    scrollTrigger: {
      trigger: palco,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,          /* um respiro de inércia: sem isso o movimento fica seco */
      pin: false,          /* o sticky do CSS já segura a cena; pin aqui brigaria */
    },
  });

  linhaDoTempo.to(estado, {
    quadro: CONF.total,
    ease: 'none',
    onUpdate: () => {
      const alvo = Math.round(estado.quadro);
      const disponivel = quadroDisponivel(alvo);
      if (disponivel !== quadroAtual) {
        quadroAtual = disponivel;
        desenhar(quadroAtual);
      }
    },
  }, 0);

  /* A abertura sai de cena logo no começo do percurso: ela é o cartão de
     visita, não companhia para o trajeto inteiro. */
  linhaDoTempo.to(abertura, { autoAlpha: 0, y: -40, ease: 'power2.in', duration: .12 }, 0.02);

  /* Frases: entram por máscara, seguram, e saem. Os tempos são frações do
     percurso — casados com o que a câmera está mostrando naquele ponto:
     porta, expositores e a parede da marca. */
  const MOMENTOS = [0.18, 0.44, 0.68];
  frases.forEach((frase, i) => {
    const linhas = frase.querySelectorAll('.mascara > span');
    const t = MOMENTOS[i];

    linhaDoTempo.set(frase, { autoAlpha: 1 }, t);
    linhaDoTempo.fromTo(linhas,
      { yPercent: 115 },
      { yPercent: 0, ease: 'power3.out', duration: .08, stagger: .015 }, t);
    linhaDoTempo.to(linhas,
      { yPercent: -115, ease: 'power2.in', duration: .06, stagger: .01 }, t + .14);
    linhaDoTempo.set(frase, { autoAlpha: 0 }, t + .21);
  });

  /* ─── Chegada: a loja vira menu ───────────────────────────────────────
     A cena escurece, o menu sobe e o Eduardo entra depois — nessa ordem,
     para o olho ter tempo de entender que a navegação apareceu. */
  linhaDoTempo.to(veu, { opacity: 1, ease: 'power2.inOut', duration: .1 }, 0.82);
  linhaDoTempo.set(menu, { attr: { 'data-aberto': 'true' } }, 0.84);
  linhaDoTempo.fromTo(menu,
    { autoAlpha: 0, y: 30 },
    { autoAlpha: 1, y: 0, ease: 'power3.out', duration: .1 }, 0.84);

  linhaDoTempo.add(() => apresentarEduardo(false), 0.9);
  linhaDoTempo.to(barra, { y: 0, ease: 'power2.out', duration: .08 }, 0.9);

  /* ─── Eduardo ─────────────────────────────────────────────────────────
     Cutout com perspectiva, não modelo 3D. Entra pela direita, inclina
     levemente para "olhar" o menu e faz o gesto de apresentar os caminhos.
     A troca de pose é o que vende o movimento — a inclinação sozinha
     pareceria um adesivo balançando. */
  let eduardoEntrou = false;

  function apresentarEduardo(imediato) {
    if (eduardoEntrou) return;
    eduardoEntrou = true;

    const eduardo = document.querySelector('[data-eduardo]');
    if (!eduardo) return;
    const figura = eduardo.querySelector('img');
    const balao = eduardo.querySelector('[data-balao]');

    if (imediato || !temGsap) {
      gsap.set?.(eduardo, { autoAlpha: 1 });
      eduardo.style.opacity = 1;
      if (balao) balao.style.opacity = 1;
      return;
    }

    const t = gsap.timeline();
    t.fromTo(eduardo,
      { autoAlpha: 0, xPercent: 26 },
      { autoAlpha: 1, xPercent: 0, ease: 'power3.out', duration: .9 });
    /* rotateY pequeno: passa de 8 graus e o recorte plano denuncia que não
       tem volume, porque a silhueta não muda com o giro */
    t.fromTo(figura,
      { rotateY: 14, transformOrigin: '80% 50%' },
      { rotateY: 4, ease: 'power2.out', duration: 1.1 }, '<');
    t.to(balao, { opacity: 1, y: 0, scale: 1, ease: 'back.out(1.6)', duration: .5 }, '-=0.35');

    /* Sem escolha por alguns segundos, ele aponta para "como comprar" —
       vira guia, sem bloquear nada. */
    const dica = setTimeout(() => {
      figura.src = figura.dataset.poseAponta || figura.src;
      gsap.fromTo(figura, { rotateY: 4 }, { rotateY: -2, duration: .6, ease: 'power2.out' });
      document.querySelector('[data-caminho="pagamento"]')
        ?.animate(
          [{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }],
          { duration: 900, easing: 'ease-in-out' }
        );
    }, 6000);

    palco.addEventListener('click', () => clearTimeout(dica), { once: true });
  }

  /* Paralaxe do cursor: a figura acompanha de leve o ponteiro. É sutil de
     propósito — o exagero aqui é o que faz parecer stand de papelão. */
  if (!ehMobile) {
    const eduardo = document.querySelector('[data-eduardo]');
    const figura = eduardo?.querySelector('img');
    if (figura) {
      window.addEventListener('pointermove', (e) => {
        if (!eduardoEntrou) return;
        const dx = (e.clientX / window.innerWidth - .5) * 2;
        gsap.to(figura, { rotateY: 4 + dx * 5, x: dx * -10, duration: .8, ease: 'power2.out' });
      }, { passive: true });
    }
  }

  /* "Voltar à loja": reabre o menu sem repetir o percurso inteiro. */
  document.querySelector('[data-voltar]')?.addEventListener('click', (e) => {
    e.preventDefault();
    const alvo = palco.offsetTop + palco.offsetHeight * 0.88;
    window.scrollTo({ top: alvo, behavior: 'smooth' });
  });

  /* ═══════════════════════════════════════════════════════════════════════
     FASE 4 — a loja vira navegação
     Escolher um caminho recolhe o menu e espalha as opções pelo cenário,
     cada uma ancorada onde aquilo estaria na loja.
     ═══════════════════════════════════════════════════════════════════════ */
  const cenario = palco.querySelector('[data-cenario]');
  const detalhe = palco.querySelector('[data-detalhe]');
  const detalheImg = palco.querySelector('[data-detalhe-img]');
  const detalheTitulo = palco.querySelector('[data-detalhe-titulo]');
  const detalheTexto = palco.querySelector('[data-detalhe-texto]');

  function abrirCenario(modo) {
    cenario.dataset.modo = modo;
    cenario.setAttribute('aria-hidden', 'false');
    gsap.to(menu, { autoAlpha: 0, y: -20, duration: .45, ease: 'power2.inOut' });
    /* As etiquetas entram escalonadas, e não todas de uma vez: em bloco elas
       viram uma parede de botões e o olho não sabe por onde começar. */
    const visiveis = [...cenario.querySelectorAll('.etiqueta')]
      .filter((el) => getComputedStyle(el).display !== 'none');
    gsap.fromTo(visiveis,
      { autoAlpha: 0, scale: .82, y: 12 },
      { autoAlpha: 1, scale: 1, y: 0, duration: .5, stagger: .05, ease: 'back.out(1.7)' });
  }

  function fecharCenario() {
    cenario.dataset.modo = '';
    cenario.setAttribute('aria-hidden', 'true');
    detalhe.dataset.visivel = 'false';
    palco.dataset.foco = 'false';
    gsap.to(menu, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' });
  }

  palco.querySelectorAll('[data-caminho]').forEach((cartao) => {
    cartao.addEventListener('click', (e) => {
      /* Clique num item específico da lista não abre o cenário — leva direto
         para a página, que é o que a pessoa pediu ao mirar naquele link. */
      if (e.target.closest('a')) return;
      abrirCenario(cartao.dataset.caminho);
    });
  });

  palco.querySelector('[data-cenario-voltar]')?.addEventListener('click', fecharCenario);

  /* Deep link: entrada.html#produto e #pagamento abrem o caminho direto.
     Serve para campanha ("veja as formas de pagamento") cair já no lugar
     certo, sem obrigar a percorrer a abertura de novo. */
  const caminhoNaUrl = location.hash.replace('#', '');
  if (caminhoNaUrl === 'produto' || caminhoNaUrl === 'pagamento') {
    requestAnimationFrame(() => {
      /* 88% e não o fim do documento: no fim o sticky já soltou e a cena
         saiu da tela, sobrando o fundo preto do trilho. 88% é onde o
         percurso termina e o menu está no ar — o mesmo ponto que o
         "Voltar à loja" usa. */
      window.scrollTo(0, palco.offsetTop + palco.offsetHeight * 0.88);
      setTimeout(() => abrirCenario(caminhoNaUrl), 260);
    });
  }

  /* Foco: o cenário desfoca e a etiqueta apontada segue nítida, com o
     aparelho e a descrição vindo para a frente. */
  cenario.querySelectorAll('.etiqueta').forEach((etq) => {
    const entrar = () => {
      palco.dataset.foco = 'true';
      const img = etq.dataset.produto;
      detalheImg.hidden = !img;
      if (img) detalheImg.src = img;
      detalheTitulo.textContent = etq.querySelector('.etiqueta-nome').textContent;
      detalheTexto.textContent = etq.dataset.descricao || '';
      detalhe.dataset.visivel = 'true';
    };
    const sair = () => {
      palco.dataset.foco = 'false';
      detalhe.dataset.visivel = 'false';
    };
    etq.addEventListener('pointerenter', entrar);
    etq.addEventListener('focus', entrar);
    etq.addEventListener('pointerleave', sair);
    etq.addEventListener('blur', sair);

    /* ═══════════════════════════════════════════════════════════════════
       FASE 6 — o card cresce e vira o banner da categoria
       ═══════════════════════════════════════════════════════════════════ */
    etq.addEventListener('click', (e) => {
      if (!querMovimento) return;              /* sem movimento, navegação seca */
      e.preventDefault();
      crescerEIr(etq);
    });
  });

  /* FLIP na mão: mede onde a etiqueta está, cria um clone fixo exatamente
     ali e o faz crescer até a tela inteira. O destino só é chamado quando a
     animação termina — carregar no meio congela o movimento, e um
     movimento que trava é pior do que não ter movimento. */
  function crescerEIr(etq) {
    const destino = etq.getAttribute('href');
    const r = etq.getBoundingClientRect();

    const clone = document.createElement('div');
    clone.className = 'transicao';
    Object.assign(clone.style, {
      left: `${r.left}px`, top: `${r.top}px`,
      width: `${r.width}px`, height: `${r.height}px`,
    });

    if (etq.dataset.produto) {
      const img = document.createElement('img');
      img.src = etq.dataset.produto;
      img.alt = '';
      clone.appendChild(img);
    }
    const titulo = document.createElement('p');
    titulo.className = 'transicao-titulo';
    titulo.textContent = etq.querySelector('.etiqueta-nome').textContent;
    clone.appendChild(titulo);

    document.body.appendChild(clone);

    const t = gsap.timeline({
      onComplete: () => { window.location.href = destino; },
    });
    t.to(clone, {
      left: 0, top: 0, width: '100vw', height: '100svh', borderRadius: 0,
      duration: .62, ease: 'power3.inOut',
    });
    /* O cenário recua enquanto o card cresce: é o que dá a leitura de que o
       produto foi retirado da loja, e não de que uma caixa cobriu a tela. */
    t.to(palco, { scale: .94, autoAlpha: .35, duration: .62, ease: 'power3.inOut' }, 0);
    t.to(titulo, { opacity: 1, y: 0, duration: .3, ease: 'power2.out' }, .34);
    t.fromTo(clone.querySelector('img'),
      { scale: .7, opacity: .6 },
      { scale: 1, opacity: 1, duration: .55, ease: 'power2.out' }, .1);
  }
})();
