/**
 * Comportamento não-decorativo: menu mobile, ano do rodapé e o
 * carregamento dos dados de lojas e catálogo a partir dos JSON.
 *
 * Nada aqui depende do GSAP. Se motion.js falhar, isto continua.
 */

(() => {
  iniciarMenuMobile();
  preencherAno();

  document.addEventListener("DOMContentLoaded", () => {
    montarLojas();
    montarCatalogo();
    montarDepoimentos();
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

  /* ─── Utilidades ──────────────────────────────────────────── */

  const escapar = (texto) =>
    String(texto ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]);

  async function buscarJson(caminho) {
    const resposta = await fetch(caminho);
    if (!resposta.ok) throw new Error(`${caminho} respondeu ${resposta.status}`);
    return resposta.json();
  }

  function avisarFalha(container, oQue) {
    container.innerHTML = `
      <p class="text-sm leading-relaxed text-prata">
        Não foi possível carregar ${escapar(oQue)}.
        Se você abriu o arquivo com duplo clique (<code>file://</code>),
        rode <code>npm run serve</code> — o navegador bloqueia
        <code>fetch</code> em página local por segurança.
      </p>`;
  }

  /* Avisa a camada de movimento que entrou conteúdo novo no DOM. */
  function avisarInjecao(raiz) {
    document.dispatchEvent(
      new CustomEvent("hg:conteudo-injetado", { detail: { raiz } })
    );
  }

  /* ─────────────────────────────────────────────────────────────
     Lojas — data/lojas.json
     ───────────────────────────────────────────────────────────── */
  async function montarLojas() {
    const container = document.querySelector("[data-lista-lojas]");
    if (!container) return;

    let dados;
    try {
      dados = await buscarJson(container.dataset.fonte || "data/lojas.json");
    } catch (erro) {
      console.error(erro);
      avisarFalha(container, "as lojas");
      return;
    }

    const limite = Number(container.dataset.limite || 0);

    /* Na home mostramos poucas unidades e nunca a que ainda vai abrir —
       um cartão "em breve" no lugar de uma loja real desperdiça espaço.
       Na página de lojas a lista é completa, Pelotas incluída. */
    const fonte = limite > 0 ? dados.lojas.filter((l) => !l.em_breve) : dados.lojas;
    const lojas = limite > 0 ? fonte.slice(0, limite) : fonte;

    container.innerHTML = lojas.map(cartaoLoja).join("");

    /* Os contadores vêm do JSON, não de número escrito à mão no HTML.
       "Unidades" conta só as abertas; Pelotas entra separado. */
    const abertas = dados.lojas.filter((l) => !l.em_breve).length;
    const emBreve = dados.lojas.length - abertas;

    document.querySelectorAll("[data-total-lojas]").forEach((el) => {
      el.dataset.contador = String(abertas);
      el.textContent = String(abertas);
    });

    document.querySelectorAll("[data-cidades-lojas]").forEach((el) => {
      const cidades = new Set(dados.lojas.filter((l) => !l.em_breve).map((l) => l.cidade));
      el.dataset.contador = String(cidades.size);
      el.textContent = String(cidades.size);
    });

    document.querySelectorAll("[data-em-breve]").forEach((el) => {
      el.textContent = String(emBreve);
      el.closest("[data-em-breve-bloco]")?.toggleAttribute("hidden", emBreve === 0);
    });

    avisarInjecao(container);
  }

  /* Endereço completo em uma linha, para o link de rota e o schema */
  function enderecoCompleto(loja) {
    return [loja.endereco, loja.bairro, loja.cidade, loja.uf, "Brasil"]
      .filter(Boolean)
      .join(", ");
  }

  /* Link de rota do Google Maps.
     Com coordenada, aponta para o ponto exato. Sem coordenada — caso das
     unidades novas — usa o endereço como texto de busca, que o Maps
     resolve igualmente bem. É por isso que uma loja sem lat/lng ainda
     tem "Como chegar" funcionando. */
  function linkRota(loja) {
    const base = "https://www.google.com/maps/dir/?api=1&destination=";
    return loja.coord
      ? `${base}${loja.coord.lat},${loja.coord.lng}`
      : `${base}${encodeURIComponent(enderecoCompleto(loja))}`;
  }

  function cartaoLoja(loja) {
    /* Unidade anunciada e ainda não aberta: cartão em estado próprio,
       sem endereço, sem horário e sem link que não leva a nada. */
    if (loja.em_breve) {
      return `
      <article class="cartao border-dashed p-7 sm:p-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-2xl text-branco sm:text-3xl">${escapar(loja.cidade)}</h3>
            <p class="rotulo mt-1">${escapar(loja.uf)}</p>
          </div>
          <span class="mt-1 rounded-full border border-azul/40 bg-azul/10 px-3 py-1
                       text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-azul">
            Em breve
          </span>
        </div>
        <p class="mt-6 text-sm leading-relaxed text-prata">
          Unidade em preparação. O endereço e o horário entram aqui na abertura.
        </p>
      </article>`;
    }

    const h = loja.horarios || {};
    const linhas = [
      ["Seg a sex", h.semana],
      ["Sábado", h.sabado],
      ["Domingo", h.domingo],
    ].filter(([, faixa]) => faixa && faixa !== "fechado");

    const zaps = loja.whatsapp || [];
    const titulo = loja.unidade
      ? `${loja.cidade} <span class="text-prata">· ${loja.unidade}</span>`
      : escapar(loja.cidade);

    return `
      <article class="cartao group p-7 sm:p-8" id="${escapar(loja.id)}">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-2xl text-branco sm:text-3xl">${titulo}</h3>
            <p class="rotulo mt-1">
              ${escapar(loja.uf)}${loja.matriz ? " · Matriz" : ""}
            </p>
          </div>
          <span aria-hidden="true"
                class="mt-1 size-2 shrink-0 rounded-full bg-azul
                       shadow-[0_0_16px_3px_var(--color-azul-brilho)]"></span>
        </div>

        <address class="mt-5 not-italic text-sm leading-relaxed text-prata">
          ${escapar(loja.endereco)}${
            loja.complemento ? `<br /><span class="text-cinza">${escapar(loja.complemento)}</span>` : ""
          }${loja.bairro ? `<br />${escapar(loja.bairro)}` : ""}${
            loja.cep ? `<br /><span class="text-cinza">CEP ${escapar(loja.cep)}</span>` : ""
          }
        </address>

        ${
          linhas.length
            ? `<dl class="mt-5 space-y-1 text-sm">
                 ${linhas
                   .map(
                     ([rotulo, faixa]) => `
                       <div class="flex justify-between gap-3">
                         <dt class="text-cinza">${escapar(rotulo)}</dt>
                         <dd class="text-branco tabular-nums">${escapar(faixa)}</dd>
                       </div>`
                   )
                   .join("")}
               </dl>`
            : ""
        }

        ${
          zaps.length
            ? `<div class="mt-6">
                 <p class="rotulo mb-2 text-[0.625rem]">
                   WhatsApp${zaps.length > 1 ? ` · ${zaps.length} números` : ""}
                 </p>
                 <ul class="space-y-1.5">
                   ${zaps
                     .map(
                       (z) => `
                         <li>
                           <a class="link-sub text-sm font-semibold text-azul tabular-nums"
                              href="https://wa.me/${escapar(z.numero)}"
                              target="_blank" rel="noopener noreferrer">
                             ${escapar(z.exibicao)}
                           </a>
                         </li>`
                     )
                     .join("")}
                 </ul>
               </div>`
            : ""
        }

        <div class="mt-6 border-t border-branco/10 pt-5">
          <a class="link-sub text-sm text-prata hover:text-branco"
             href="${escapar(linkRota(loja))}" target="_blank" rel="noopener noreferrer">
            Como chegar${loja.coord ? "" : " (por endereço)"}
          </a>
        </div>
      </article>`;
  }

  /* ─────────────────────────────────────────────────────────────
     Marcas — data/catalogo.json
     A página é institucional: mostra só as marcas que a rede
     trabalha. Nada de modelo, preço ou parcela por aparelho — a
     condição sai da simulação presencial na loja.
     ───────────────────────────────────────────────────────────── */
  async function montarCatalogo() {
    const container = document.querySelector("[data-catalogo]");
    if (!container) return;

    let dados;
    try {
      dados = await buscarJson(container.dataset.fonte || "data/catalogo.json");
    } catch (erro) {
      console.error(erro);
      avisarFalha(container, "o catálogo");
      return;
    }

    container.innerHTML = dados.marcas.map((marca) => blocoMarca(marca)).join("");
    montarFiltros(dados.marcas);
    montarAcessorios(dados.acessorios);
    avisarInjecao(document);
  }

  function blocoMarca(marca) {
    return `
      <section id="${escapar(marca.id)}" class="scroll-mt-28" data-marca="${escapar(marca.id)}">
        <header class="flex flex-wrap items-center gap-6 border-b
                       border-branco/10 pb-6">
          <div class="flex items-center gap-5">
            <img src="${escapar(marca.logo)}" alt="Logo ${escapar(marca.nome)}"
                 width="64" height="64" loading="lazy" decoding="async"
                 class="size-14 rounded-xl bg-grafite object-contain p-2" />
            <div>
              <h2 class="texto-medio text-branco">${escapar(marca.nome)}</h2>
              ${
                /* `resumo` é opcional: as marcas promovidas da faixa de
                   parceiras ainda não têm texto escrito. Sem a guarda, o
                   bloco sairia com um parágrafo vazio ocupando espaço. */
                marca.resumo
                  ? `<p class="mt-2 max-w-xl text-sm leading-relaxed text-prata">
                ${escapar(marca.resumo)}
              </p>`
                  : ""
              }
            </div>
          </div>
        </header>
      </section>`;
  }

  /* ─────────────────────────────────────────────────────────────
     Depoimentos — data/depoimentos.json

     Carrossel sem biblioteca: a faixa é um contêiner com rolagem
     horizontal nativa e scroll-snap; os botões só empurram o scroll.
     Sai de graça o que uma lib cobraria caro — arrastar com o dedo,
     rolar com o trackpad e navegar pelo teclado.
     ───────────────────────────────────────────────────────────── */
  async function montarDepoimentos() {
    const container = document.querySelector("[data-depoimentos]");
    if (!container) return;

    let dados;
    try {
      dados = await buscarJson(container.dataset.fonte || "data/depoimentos.json");
    } catch (erro) {
      console.error(erro);
      avisarFalha(container, "os depoimentos");
      return;
    }

    const lista = Array.isArray(dados.depoimentos) ? dados.depoimentos : [];

    /* Sem depoimento real, mostra a pendência — nunca um comentário
       inventado. Ver B15 no PLANO-DE-APLICACAO.md. */
    if (!lista.length) {
      container.classList.remove("snap-x", "snap-mandatory");
      container.innerHTML = `
        <aside class="cartao cartao-azul w-full p-7" data-pendencia="B15">
          <p class="rotulo">Conteúdo pendente · B15</p>
          <p class="mt-3 text-sm leading-relaxed">
            Faltam os depoimentos reais dos clientes. No site antigo eles eram
            prints de tela, e a pasta de imagens deste projeto está vazia.
          </p>
        </aside>`;
      avisarInjecao(document);
      return;
    }

    container.innerHTML = lista.map(cartaoDepoimento).join("");
    animarDepoimentos(container);
    avisarInjecao(document);
  }

  /* Paleta de avatar do Google para quem não tem foto. A cor sai do
     nome, então o mesmo autor recebe sempre a mesma — se fosse
     sorteada, mudaria a cada carregamento e denunciaria que o card
     é reconstruído. */
  const CORES_AVATAR = ["#7b1fa2", "#0b8043", "#3367d6", "#c5221f", "#e37400", "#00796b"];

  function corDoAvatar(nome) {
    let soma = 0;
    for (const ch of String(nome)) soma += ch.codePointAt(0);
    return CORES_AVATAR[soma % CORES_AVATAR.length];
  }

  /* Reproduz o card de avaliação do Google: avatar, nome, linha de
     metadados do autor, estrelas âmbar, data e o texto. É o formato
     em que essas avaliações já eram publicadas no site antigo (como
     print) — manter a aparência é o que sinaliza ao visitante que
     são avaliações reais, e não elogios escritos pela própria loja. */
  function cartaoDepoimento(depoimento) {
    const nota = Number(depoimento.nota);
    const inicial = String(depoimento.nome || "?").trim().charAt(0).toUpperCase();

    const estrelas =
      nota >= 1 && nota <= 5
        ? `<span class="avaliacao-estrelas" role="img" aria-label="${nota} de 5 estrelas">${"★".repeat(
            Math.round(nota)
          )}</span>`
        : "";

    // "Local Guide · 15 avaliações · 6 fotos" — só entra o que existe.
    const partes = [];
    if (depoimento.local_guide) partes.push('<span class="avaliacao-selo">Local Guide</span>');
    if (depoimento.avaliacoes)
      partes.push(
        `${depoimento.avaliacoes} ${depoimento.avaliacoes === 1 ? "avaliação" : "avaliações"}`
      );
    if (depoimento.fotos)
      partes.push(`${depoimento.fotos} ${depoimento.fotos === 1 ? "foto" : "fotos"}`);
    const meta = partes.length
      ? `<p class="avaliacao-meta mt-0.5 text-xs">${partes.join(" · ")}</p>`
      : "";

    const quando = depoimento.quando
      ? `<span class="avaliacao-data text-xs">${escapar(depoimento.quando)}</span>`
      : "";

    return `
      <figure class="avaliacao-cartao flex w-[85%] shrink-0 flex-col p-7 sm:w-[46%] lg:w-[31%]" tabindex="0">
        <div class="flex items-center gap-3">
          ${
            depoimento.foto
              ? `<img class="avaliacao-avatar" src="${escapar(depoimento.foto)}"
                      alt="" width="96" height="96" loading="lazy" decoding="async" />`
              : `<span class="avaliacao-avatar" style="--avatar-cor: ${corDoAvatar(
                  depoimento.nome
                )}" aria-hidden="true">${escapar(inicial)}</span>`
          }
          <div class="min-w-0">
            <figcaption class="avaliacao-nome truncate text-sm font-semibold">
              ${escapar(depoimento.nome)}
            </figcaption>
            ${meta}
          </div>
        </div>

        <div class="mt-4 flex items-center gap-2">
          ${estrelas}
          ${quando}
        </div>

        <blockquote class="avaliacao-texto mt-3 text-sm leading-relaxed">
          ${escapar(depoimento.texto)}
        </blockquote>

        <p class="avaliacao-origem mt-5">
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="#4285f4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"/>
            <path fill="#34a853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"/>
            <path fill="#fbbc04" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.7l4-3z"/>
            <path fill="#ea4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"/>
          </svg>
          Avaliação publicada no Google
        </p>
      </figure>`;
  }

  /* Tempo de uma volta completa da esteira.

     A velocidade não é fixada em pixels por segundo: sai daí dividida pelo
     comprimento do ciclo. Assim ela se ajusta sozinha a cada breakpoint —
     no celular o ciclo é mais curto, o movimento fica proporcionalmente
     mais lento, e a sensação de leitura se mantém. Uma velocidade fixa em
     px/s deixaria o celular rápido demais. */
  const DURACAO_VOLTA = 40000;

  /* Depois de arrastar, a rolagem por inércia continua sozinha por um
     tempo. Retomar no `pointerup` faria o laço disputar com ela. */
  const ESPERA_APOS_ARRASTO = 700;

  /* ─────────────────────────────────────────────────────────────
     Carrossel automático de depoimentos

     Sem biblioteca: a faixa é um contêiner de rolagem horizontal nativa
     com scroll-snap. O JS só empurra o scroll — arrastar com o dedo,
     rolar no trackpad e o encaixe entre cards saem prontos do navegador.

     O loop é fechado DUPLICANDO a lista. A alternativa óbvia — voltar ao
     início com scrollTo(0) — rebobinaria ~6.600px na frente do visitante,
     que é exatamente o "salto" a evitar. Com a lista duplicada, ao passar
     do último original o scroll recua um período inteiro de uma vez; como
     o conteúdo naquele ponto é idêntico, a emenda é invisível.
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

  function montarFiltros(marcas) {
    const nav = document.querySelector("[data-filtros-marca]");
    if (!nav) return;

    nav.innerHTML = marcas
      .map(
        (m) => `
          <a href="#${escapar(m.id)}"
             class="btn btn-linha px-5 py-2.5 text-[0.6875rem]">
            ${escapar(m.nome)}
          </a>`
      )
      .join("");
  }

  function montarAcessorios(acessorios) {
    const container = document.querySelector("[data-acessorios]");
    if (!container || !acessorios?.length) return;

    /* Frase corrida, nomes separados só por vírgula — decisão do cliente em
       2026-07-28. O campo `descricao` do JSON deixou de ser usado aqui; ficou
       guardado lá para quando a linha voltar a ter texto por item.

       textContent e não innerHTML: como não há marcação para montar, escrever
       texto puro dispensa escapar() e fecha a porta para injeção de HTML vinda
       do JSON. */
    container.textContent = acessorios.map((a) => a.nome).join(", ") + ".";
  }
})();
