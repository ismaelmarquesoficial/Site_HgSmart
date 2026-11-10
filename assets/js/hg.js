/* Rede HG Smart — comportamento e movimento.
   Regra do DESIGN.md: o conteúdo está no HTML; este arquivo só acrescenta estado (aberta agora, filtros) e movimento.
   Um orquestrador de scroll (GSAP + ScrollTrigger), uma rolagem suave (Lenis). Com prefers-reduced-motion nada disso liga. */
(() => {
  'use strict';
  window.__hg = true;
  const html = document.documentElement;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const pagina = $('.pagina') || document.body;
  const RAIZ = pagina.dataset.raiz || '';
  const LOJA_PAG = pagina.dataset.loja || '';
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOV = !!(window.gsap && window.ScrollTrigger) && !reduz && html.classList.contains('motion-ok');
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches;
  html.classList.add('com-js');
  if (!MOV) html.classList.remove('motion-ok', 'estreia');

  const LOJAS = [{"id":"santa-cruz-do-sul","cidade":"Santa Cruz do Sul","tag":"Matriz","regiao":"vales","end":"Rua Marechal Floriano, 829","comp":"esquina com a Ramiro Barcelos · Centro","sem":["08:30","19:00"],"sab":["08:30","17:00"],"dom":null,"zaps":["(51) 9 9857-5806","(51) 9 2003-5624","(51) 9 9017-8584","(51) 9 2003-1613"],"luz":true,"url":"lojas/santa-cruz-do-sul/index.html","foto":"assets/lojas/santa-cruz/fachada.webp","rota":"https://www.google.com/maps/dir/?api=1&destination=-29.7185488,-52.427873"},{"id":"lajeado","cidade":"Lajeado","tag":"Vale do Taquari","regiao":"vales","end":"Rua Júlio de Castilhos, 630","comp":"esquina com João Batista de Melo · Centro","sem":["08:30","19:00"],"sab":["08:30","17:00"],"dom":null,"zaps":["(51) 9 2006-8940","(51) 9 2005-1952"],"luz":true,"url":"lojas/lajeado/index.html","foto":"assets/lojas/lajeado/fachada.webp","rota":"https://www.google.com/maps/dir/?api=1&destination=-29.4650687,-51.9642869"},{"id":"cachoeira-do-sul","cidade":"Cachoeira do Sul","tag":"Unidade 1","regiao":"vales","end":"Rua Sete de Setembro, 1385","comp":"Centro","sem":["08:30","18:30"],"sab":["08:30","17:00"],"dom":null,"zaps":["(51) 9 2006-9863","(51) 9 2005-8687"],"luz":true,"url":"lojas/cachoeira-do-sul/index.html","foto":"assets/lojas/cachoeira-do-sul/fachada.webp","rota":"https://www.google.com/maps/dir/?api=1&destination=Rua%20Sete%20de%20Setembro%2C%201385%2C%20Cachoeira%20do%20Sul%2C%20RS"},{"id":"capao-da-canoa","cidade":"Capão da Canoa","tag":"Litoral Norte","regiao":"litoral","end":"Rua Andira, 509 · Sala 5","comp":"Centro","sem":["09:00","18:00"],"sab":["09:00","17:00"],"dom":null,"zaps":["(51) 9 2006-3948","(51) 9 2005-1933"],"luz":false,"url":"lojas/capao-da-canoa/index.html","foto":"assets/lojas/capao-da-canoa/fachada.webp","rota":"https://www.google.com/maps/dir/?api=1&destination=-29.7608154,-50.0187694"},{"id":"caxias-do-sul","cidade":"Caxias do Sul","tag":"Serra","regiao":"serra","end":"Rua Feijó Júnior, 390","comp":"São Pelegrino","sem":["08:30","18:30"],"sab":["08:30","17:00"],"dom":null,"zaps":["(54) 9 2001-5583","(54) 9 2000-3795"],"luz":true,"url":"lojas/caxias-do-sul/index.html","foto":"assets/lojas/caxias-do-sul/fachada.webp","rota":"https://www.google.com/maps/dir/?api=1&destination=-29.1646381,-51.1884351"},{"id":"cachoeirinha","cidade":"Cachoeirinha","tag":"Grande Porto Alegre","regiao":"metro","end":"Avenida Lídio Batista, 69","comp":"Centro","sem":["08:30","18:30"],"sab":["08:30","17:00"],"dom":null,"zaps":["(51) 9 2007-4393","(51) 9 2005-5643"],"luz":true,"url":"lojas/cachoeirinha/index.html","foto":"assets/lojas/cachoeirinha/fachada.webp","rota":"https://www.google.com/maps/dir/?api=1&destination=-29.9486248,-51.0971031"},{"id":"tramandai","cidade":"Tramandaí","tag":"Litoral Norte","regiao":"litoral","end":"Rua 24 de Setembro, 241 · Sala 5","comp":"Centro","sem":["09:00","18:00"],"sab":["09:00","17:00"],"dom":null,"zaps":["(51) 9 2005-4059","(51) 9 2001-0265"],"luz":false,"url":"lojas/tramandai/index.html","foto":"assets/lojas/tramandai/fachada.webp","rota":"https://www.google.com/maps/dir/?api=1&destination=-29.987523,-50.1375128"},{"id":"santa-maria","cidade":"Santa Maria","tag":"Região Central","regiao":"vales","end":"Rua Serafim Valandro, 835","comp":"esquina com Dr. Bozano · Centro","sem":["08:30","19:00"],"sab":["08:30","17:00"],"dom":null,"zaps":["(55) 9 2001-9043","(55) 9 2001-5126"],"luz":true,"url":"lojas/santa-maria/index.html","foto":"assets/lojas/santa-maria/fachada.webp","rota":"https://www.google.com/maps/dir/?api=1&destination=Rua%20Serafim%20Valandro%2C%20835%2C%20Santa%20Maria%2C%20RS"},{"id":"farroupilha","cidade":"Farroupilha","tag":"Serra","regiao":"serra","end":"Rua Pinheiro Machado, 370","comp":"esquina com 13 de Maio · Centro","sem":["08:30","18:30"],"sab":["08:30","17:00"],"dom":null,"zaps":["(54) 9 2001-7051","(54) 9 2001-4436"],"luz":true,"url":"lojas/farroupilha/index.html","foto":"assets/lojas/farroupilha/fachada.webp","rota":"https://www.google.com/maps/dir/?api=1&destination=Rua%20Pinheiro%20Machado%2C%20370%2C%20Farroupilha%2C%20RS"},{"id":"bento-goncalves","cidade":"Bento Gonçalves","tag":"Serra","regiao":"serra","end":"Rua Saldanha Marinho, 164 · Sala 01","comp":"Centro","sem":["08:30","18:30"],"sab":["08:30","17:00"],"dom":null,"zaps":["(54) 9 2001-7049","(54) 9 2001-4437"],"luz":true,"url":"lojas/bento-goncalves/index.html","foto":"assets/lojas/bento-goncalves/fachada.webp","rota":"https://www.google.com/maps/dir/?api=1&destination=Rua%20Saldanha%20Marinho%2C%20164%2C%20Bento%20Gon%C3%A7alves%2C%20RS"}];
  const ICO_ZAP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 1-13.4 7.8L3 21l1.2-4.6A9 9 0 1 1 21 12z"/></svg>';
  const wa = (n, txt) => 'https://wa.me/55' + n.replace(/\D/g, '') + (txt ? '?text=' + encodeURIComponent(txt) : '');

  /* ─────────── Aberta agora? (horário de Brasília) ─────────── */
  const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const min = (s) => { const a = s.split(':'); return +a[0] * 60 + +a[1]; };
  function agora() {
    try {
      const o = {};
      new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).forEach((x) => { o[x.type] = x.value; });
      const d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
      if (d < 0) throw 0;
      return { d, m: (+o.hour % 24) * 60 + +o.minute };
    } catch (e) { const n = new Date(); return { d: n.getDay(), m: n.getHours() * 60 + n.getMinutes() }; }
  }
  const faixa = (l, d) => (d === 0 ? l.dom : d === 6 ? l.sab : l.sem);
  function statusDe(l) {
    const t = agora(), f = faixa(l, t.d);
    if (f && t.m >= min(f[0]) && t.m < min(f[1])) return { aberta: true, txt: 'Aberta agora · fecha às ' + f[1] };
    for (let k = 0; k < 8; k++) {
      const d = (t.d + k) % 7, g = faixa(l, d);
      if (!g || (k === 0 && t.m >= min(g[0]))) continue;
      return { aberta: false, txt: 'Fechada agora · abre ' + (k === 0 ? 'hoje' : k === 1 ? 'amanhã' : DIAS[d] + '.') + ' às ' + g[0] };
    }
    return { aberta: false, txt: 'Fechada agora' };
  }
  const porId = (id) => LOJAS.find((x) => x.id === id);
  function pintarStatus() {
    $$('[data-status]').forEach((e) => {
      const l = porId(e.dataset.status); if (!l) return;
      const s = statusDe(l);
      e.classList.toggle('aberta', s.aberta);
      e.innerHTML = '<span class="pulso' + (s.aberta ? ' aberta' : '') + '"></span><span>' + s.txt + '</span>';
    });
    $$('[data-pulso]').forEach((e) => { const l = porId(e.dataset.pulso); if (l) { const s = statusDe(l); e.classList.toggle('aberta', s.aberta); e.title = s.txt; } });
    const n = LOJAS.filter((l) => statusDe(l).aberta).length;
    $$('[data-abertas]').forEach((e) => { e.textContent = n; });
    $$('[data-abertas-txt]').forEach((e) => { e.textContent = n === 0 ? 'lojas abertas neste momento. ' + statusDe(LOJAS[0]).txt.replace('Fechada agora · a', 'A matriz a') + '.' : n === 1 ? 'loja aberta neste momento' : 'lojas abertas neste momento'; });
    $$('[data-abertas-pulso]').forEach((e) => e.classList.toggle('aberta', n > 0));
    const hoje = agora().d, linha = hoje === 0 ? 2 : hoje === 6 ? 1 : 0;
    $$('.horas').forEach((dl) => $$('div', dl).forEach((d, i) => d.classList.toggle('hoje', i === linha)));
  }
  if (LOJAS.length) { pintarStatus(); setInterval(pintarStatus, 60000); }

  /* ─────────── Cabeçalho, progresso e barra do celular (sem depender do GSAP) ─────────── */
  const topo = $('.topo'), prog = $('.progresso'), barra = $('.barra');
  let ultY = window.scrollY, tic = false, rolou = false;
  function aoRolar() {
    tic = false;
    const y = window.scrollY, max = html.scrollHeight - innerHeight;
    if (topo) { topo.classList.toggle('solido', y > 40); topo.classList.toggle('some', y > ultY && y > innerHeight * .8 && !html.classList.contains('menu-aberto')); }
    if (prog) prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    if (barra) barra.classList.toggle('on', y > innerHeight * .5);
    if (!rolou && y > 8) { rolou = true; html.classList.add('rolou'); }
    ultY = y;
  }
  window.addEventListener('scroll', () => { if (!tic) { tic = true; requestAnimationFrame(aoRolar); } }, { passive: true });
  aoRolar();

  /* ─────────── Menu em tela cheia ─────────── */
  let lenis = null;
  const menu = $('#menu'), menuB = $('.menu-b');
  function alternarMenu(abrir) {
    const on = abrir == null ? !html.classList.contains('menu-aberto') : abrir;
    html.classList.toggle('menu-aberto', on);
    if (menuB) { menuB.setAttribute('aria-expanded', on ? 'true' : 'false'); $('span', menuB).textContent = on ? 'Fechar' : 'Menu'; }
    if (menu) { menu.setAttribute('aria-hidden', on ? 'false' : 'true'); if (on) { menu.scrollTop = 0; const a = $('a', menu); if (a) setTimeout(() => a.focus({ preventScroll: true }), 60); } else if (menuB) menuB.focus({ preventScroll: true }); }
    document.body.style.overflow = on ? 'hidden' : '';
    if (lenis) { if (on) lenis.stop(); else lenis.start(); }
  }
  if (menuB && menu) {
    menuB.addEventListener('click', () => alternarMenu());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && html.classList.contains('menu-aberto')) alternarMenu(false); });
  }

  /* ─────────── Perguntas ─────────── */
  $$('.faq-b').forEach((b) => b.addEventListener('click', () => {
    const item = b.parentElement, lista = item.closest('.faq-l') || document, abrir = !item.classList.contains('aberto');
    $$('.faq-i', lista).forEach((i) => { i.classList.remove('aberto'); $('.faq-b', i).setAttribute('aria-expanded', 'false'); });
    if (abrir) { item.classList.add('aberto'); b.setAttribute('aria-expanded', 'true'); }
    if (MOV) setTimeout(() => window.ScrollTrigger.refresh(), 600);
  }));

  /* ─────────── Copiar ─────────── */
  $$('[data-copiar]').forEach((b) => b.addEventListener('click', () => {
    const txt = b.dataset.copiar, rot = b.textContent;
    const ok = () => { b.textContent = 'Copiado'; setTimeout(() => { b.textContent = rot; }, 1800); };
    const sel = () => { const alvo = b.previousElementSibling; if (alvo) { const r = document.createRange(); r.selectNodeContents(alvo); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } };
    try { navigator.clipboard.writeText(txt).then(ok, sel); } catch (e) { sel(); }
  }));

  /* ─────────── Telas do aparelho: um traço por parcela ─────────── */
  $$('.t-ticks').forEach((el) => { el.innerHTML = '<i></i>'.repeat(+el.dataset.n || 0); });

  /* ─────────── Vitrine de campanhas ─────────── */
  $$('.vitrine').forEach((vt) => {
    const slides = $$('.vt-slide', vt), pontos = $$('.vt-pontos button', vt), leg = $('.vt-leg', vt), palco = $('.vt-palco', vt);
    if (slides.length < 2) return;
    let i = 0, tmr = null, pausa = false, visivel = false;
    function ir(n, usuario) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle('on', k === i); s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); const a = $('a', s); if (a) a.tabIndex = k === i ? 0 : -1; });
      pontos.forEach((p, k) => p.setAttribute('aria-current', k === i ? 'true' : 'false'));
      if (leg) leg.textContent = slides[i].dataset.leg || '';
      if (MOV && window.gsap) window.gsap.fromTo($('img', slides[i]), { scale: 1.06 }, { scale: 1, duration: 1.4, ease: 'power3.out', overwrite: true });
      if (usuario) agendar();
    }
    function agendar() { clearInterval(tmr); if (!reduz) tmr = setInterval(() => { if (!pausa && visivel && !document.hidden) ir(i + 1); }, 5000); }
    pontos.forEach((p, k) => p.addEventListener('click', () => ir(k, true)));
    const ant = $('[data-ant]', vt), prox = $('[data-prox]', vt);
    if (ant) ant.addEventListener('click', () => ir(i - 1, true));
    if (prox) prox.addEventListener('click', () => ir(i + 1, true));
    vt.addEventListener('pointerenter', () => { pausa = true; }); vt.addEventListener('pointerleave', () => { pausa = false; });
    vt.addEventListener('focusin', () => { pausa = true; }); vt.addEventListener('focusout', () => { pausa = false; });
    let x0 = null;
    palco.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    palco.addEventListener('touchend', (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 44) ir(i + (dx < 0 ? 1 : -1), true); }, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visivel = es[0].isIntersecting; }, { threshold: .35 }).observe(palco); else visivel = true;
    ir(0); agendar();
  });

  /* ─────────── Lojas: lista, mapa e cartão ─────────── */
  let ativarLoja = null, lojaMexeu = false;
  (function () {
    const caixa = $('#ljMapa'); if (!caixa) return;
    const lista = $('#ljLista'), svg = $('svg', caixa), card = $('#ljCard');
    const el = { foto: $('#ljFoto'), cidade: $('#ljCidade'), tag: $('#ljTag'), st: $('#ljStatus'), end: $('#ljEnd'), horas: $('#ljHoras'), zaps: $('#ljZaps'), zapBtn: $('#ljZapBtn'), rota: $('#ljRota'), pag: $('#ljPag'), nota: $('#ljNota'), corpo: $('.lj-corpo', card) };
    const botoes = $$('a[data-id]', lista);
    const pinos = svg ? $$('.alfinete[data-cidade]', svg) : [];
    let anel = null, atual = null, tl = null;
    if (svg) {
      anel = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      anel.setAttribute('class', 'anel'); anel.setAttribute('r', '10');
      pinos.forEach((p) => {
        const c = $('.cabeca', p); if (c && !p.classList.contains('alfinete-em-breve')) c.setAttribute('r', '9');
        const l = porId(p.dataset.cidade); if (!l) return;
        p.setAttribute('tabindex', '0'); p.setAttribute('role', 'button'); p.setAttribute('aria-label', 'Loja de ' + l.cidade);
        p.addEventListener('click', () => { lojaMexeu = true; ativar(l.id); });
        p.addEventListener('mouseenter', () => { lojaMexeu = true; ativar(l.id); });
        p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lojaMexeu = true; ativar(l.id); } });
      });
    }
    /* Na lista, o primeiro toque seleciona a loja; o link "Ver a loja" do cartão leva à página. Sem JS, cada item já é link para a página. */
    botoes.forEach((b) => {
      b.addEventListener('click', (e) => { if (b.dataset.id !== atual) { e.preventDefault(); e.stopImmediatePropagation(); lojaMexeu = true; ativar(b.dataset.id); } });
      if (fino) b.addEventListener('mouseenter', () => { lojaMexeu = true; ativar(b.dataset.id); });
    });
    function preencher(l) {
      const s = statusDe(l);
      el.foto.src = RAIZ + l.foto; el.foto.alt = 'Loja HG Smart de ' + l.cidade;
      el.cidade.textContent = l.cidade; el.tag.textContent = l.tag;
      el.st.dataset.status = l.id; el.st.className = 'status' + (s.aberta ? ' aberta' : '');
      el.st.innerHTML = '<span class="pulso' + (s.aberta ? ' aberta' : '') + '"></span><span>' + s.txt + '</span>';
      el.end.innerHTML = l.end + '<br><span>' + l.comp + '</span>';
      el.horas.innerHTML = '<div><dt>Seg a sex</dt><dd>' + l.sem.join(' – ') + '</dd></div><div><dt>Sábado</dt><dd>' + l.sab.join(' – ') + '</dd></div><div><dt>Domingo</dt><dd>' + (l.dom ? l.dom.join(' – ') : 'Fechada') + '</dd></div>';
      el.zaps.innerHTML = l.zaps.map((z) => '<a class="chip" href="' + wa(z) + '" target="_blank" rel="noopener">' + ICO_ZAP + z + '</a>').join('');
      el.zapBtn.href = wa(l.zaps[0], 'Olá! Vim pelo site da HG Smart e quero falar com a loja de ' + l.cidade + '.');
      el.rota.href = l.rota; el.pag.href = RAIZ + l.url;
      el.nota.hidden = l.luz; el.nota.textContent = l.luz ? '' : 'Esta loja não trabalha com parcela na conta de luz.';
      const hoje = agora().d, linha = hoje === 0 ? 2 : hoje === 6 ? 1 : 0;
      $$('div', el.horas).forEach((d, i) => d.classList.toggle('hoje', i === linha));
    }
    function marcar(id) {
      botoes.forEach((b) => { const on = b.dataset.id === id; b.classList.toggle('on', on); b.setAttribute('aria-current', on ? 'true' : 'false'); if (on && lista.scrollWidth > lista.clientWidth) lista.scrollTo({ left: b.offsetLeft - 20, behavior: MOV ? 'smooth' : 'auto' }); });
      pinos.forEach((p) => {
        const on = p.dataset.cidade === id, c = $('.cabeca', p);
        p.classList.toggle('on', on);
        if (on && anel && c) { anel.setAttribute('cx', c.getAttribute('cx')); anel.setAttribute('cy', c.getAttribute('cy')); p.parentNode.insertBefore(anel, p.parentNode.firstChild); }
        if (c && !p.classList.contains('alfinete-em-breve')) { if (MOV) window.gsap.to(c, { attr: { r: on ? 13 : 9 }, duration: .5, ease: 'back.out(2.5)', overwrite: true }); else c.setAttribute('r', on ? 13 : 9); }
      });
    }
    function ativar(id) {
      if (id === atual) return;
      const l = porId(id); if (!l) return;
      atual = id; marcar(id);
      if (MOV) {
        const g = window.gsap, filhos = Array.from(el.corpo.children);
        if (tl) tl.kill();
        tl = g.timeline()
          .to(filhos, { autoAlpha: 0, y: 10, duration: .16, stagger: .015, ease: 'power2.in' })
          .to(el.foto, { autoAlpha: 0, scale: 1.06, duration: .2 }, 0)
          .add(() => preencher(l))
          .to(el.foto, { autoAlpha: 1, scale: 1, duration: .7 })
          .to(filhos, { autoAlpha: 1, y: 0, duration: .5, stagger: .04 }, '<');
      } else preencher(l);
    }
    ativarLoja = ativar;
    window.addEventListener('load', () => LOJAS.forEach((l) => { const im = new Image(); im.src = RAIZ + l.foto; }));
    atual = LOJAS[0].id; preencher(LOJAS[0]); marcar(atual);
  })();

  /* ─────────── Página de lojas: filtros ─────────── */
  (function () {
    const cx = $('[data-filtros-lojas]'); if (!cx) return;
    const bts = $$('button', cx), cartoes = $$('.loja-c[data-id]'), vazio = $('#lojasVazio');
    const testa = { todas: () => true, abertas: (l) => statusDe(l).aberta, luz: (l) => l.luz, serra: (l) => l.regiao === 'serra', litoral: (l) => l.regiao === 'litoral', vales: (l) => l.regiao === 'vales', metro: (l) => l.regiao === 'metro' };
    bts.forEach((b) => { const f = testa[b.dataset.f], sm = $('small', b); if (f && sm) sm.textContent = LOJAS.filter(f).length; });
    function aplicar(nome) {
      let vis = 0;
      bts.forEach((b) => b.setAttribute('aria-pressed', b.dataset.f === nome ? 'true' : 'false'));
      cartoes.forEach((c) => { const l = porId(c.dataset.id), on = !!(l && testa[nome](l)); c.hidden = !on; if (on) vis++; });
      const breve = $('.loja-c.breve'); if (breve) breve.hidden = nome !== 'todas';
      if (vazio) vazio.hidden = vis > 0;
      if (MOV) { window.gsap.fromTo(cartoes.filter((c) => !c.hidden), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .5, stagger: .04, overwrite: true }); window.ScrollTrigger.refresh(); }
    }
    bts.forEach((b) => b.addEventListener('click', () => aplicar(b.dataset.f)));
  })();

  /* ─────────── Contato: monta a mensagem e abre o WhatsApp da loja escolhida ─────────── */
  (function () {
    const f = $('#msgForm'); if (!f) return;
    const loja = $('#msgLoja'), assunto = $('#msgAssunto'), nome = $('#msgNome'), texto = $('#msgTexto'), link = $('#msgEnviar'), previa = $('#msgPrevia');
    function montar() {
      const l = porId(loja.value) || LOJAS[0];
      const msg = 'Olá! Vim pelo site da HG Smart' + (nome.value.trim() ? ', meu nome é ' + nome.value.trim() : '') + '. Assunto: ' + assunto.value + '.' + (texto.value.trim() ? ' ' + texto.value.trim() : '');
      link.href = wa(l.zaps[0], msg);
      previa.textContent = 'Vai para ' + l.cidade + ' · ' + l.zaps[0] + ' — "' + msg + '"';
    }
    ['input', 'change'].forEach((ev) => f.addEventListener(ev, montar));
    f.addEventListener('submit', (e) => e.preventDefault());
    montar();
  })();

  /* Rolagem interna para âncoras, com ou sem Lenis */
  const irPara = (alvo, off) => {
    const y = typeof alvo === 'number' ? alvo : alvo.getBoundingClientRect().top + window.scrollY + (off || 0);
    if (lenis) lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: reduz ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1), alvo = id && document.getElementById(id); if (!alvo) return;
    e.preventDefault(); if (html.classList.contains('menu-aberto')) alternarMenu(false); irPara(alvo, -72);
  }));
  if (menu) $$('a', menu).forEach((a) => a.addEventListener('click', () => { if (a.getAttribute('href').charAt(0) !== '#') setTimeout(() => alternarMenu(false), 400); }));

  if (!MOV) { $$('.etapa').forEach((e) => e.classList.add('on')); $$('.passo').forEach((e) => e.classList.add('on')); $$('.tela').forEach((t, i) => t.classList.toggle('on', i === 0)); return; }

  /* ═══════════════════════ MOVIMENTO ═══════════════════════ */
  const { gsap, ScrollTrigger } = window;
  try {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: .9 });
    ScrollTrigger.config({ ignoreMobileResize: true });
    const SCRUB = .6, ENTRADA = 'expo.out';

    /* Rolagem suave só com mouse; no toque a rolagem nativa já é a certa */
    if (window.Lenis && fino) {
      try {
        lenis = new window.Lenis({ duration: 1.05, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      } catch (e) { lenis = null; }
    }

    /* ── Revelações: máscara por linha, fade curto, recorte de imagem ── */
    let revelou = false;
    function revelar() {
      if (revelou) return; revelou = true;
      $$('[data-linhas]').forEach((h) => {
        const ls = $$('.ln>span', h), gr = $$('.grade>i', h);
        gsap.set(ls, { y: 0, yPercent: 112 }); if (gr.length) gsap.set(gr, { scaleX: 0 });
        ScrollTrigger.create({ trigger: h, start: 'top 90%', once: true, onEnter: () => { gsap.to(ls, { yPercent: 0, duration: .9, stagger: .04, ease: 'power3.out' }); if (gr.length) gsap.to(gr, { scaleX: 1, duration: 1, delay: .35, ease: 'power3.inOut' }); } });
      });
      gsap.set('[data-r]', { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch('[data-r]', { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { autoAlpha: 1, y: 0, duration: .6, stagger: .06, ease: ENTRADA, overwrite: true }) });
      $$('.cap i').forEach((i) => gsap.from(i, { scaleX: 0, duration: 1, ease: 'power3.inOut', scrollTrigger: { trigger: i, start: 'top 94%', once: true } }));
      $$('[data-clip]').forEach((box) => {
        const img = $('img', box);
        gsap.set(box, { clipPath: 'inset(100% 0% 0% 0%)' });
        ScrollTrigger.create({ trigger: box, start: 'top 90%', once: true, onEnter: () => { gsap.to(box, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut' }); if (img) gsap.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'power3.out' }); } });
        if (img && fino) gsap.fromTo(img, { yPercent: -9 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: SCRUB } });
      });
      /* contagem: só os números da rede, uma vez por página */
      const bloco = $('.nums');
      if (bloco) $$('[data-conta]', bloco).forEach((e) => {
        const fim = +e.dataset.conta, suf = e.dataset.suf || '', o = { v: 0 };
        e.textContent = '0' + suf;
        ScrollTrigger.create({ trigger: bloco, start: 'top 88%', once: true, onEnter: () => gsap.to(o, { v: fim, duration: 1.5, ease: 'power2.out', onUpdate: () => { e.textContent = Math.round(o.v) + suf; } }) });
      });
      ScrollTrigger.refresh();
    }

    /* ── Abertura (uma vez por sessão) e cortina entre páginas ── */
    const estreia = html.classList.contains('estreia');
    const heroFoto = $('.hero-foto img'), luz = $('.hero-luz');
    if (luz) {
      gsap.set(luz, { x: innerWidth * .2, y: innerHeight * .85 });
      /* a luz respira sozinha; o cursor só a desloca */
      gsap.fromTo(luz, { scale: .94 }, { scale: 1.08, duration: 5.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
    gsap.set('.topo, .zap', { autoAlpha: 0 });
    const chegada = gsap.timeline({ paused: true })
      .add(revelar, 0)
      .to('.topo', { autoAlpha: 1, duration: .8 }, .2)
      .fromTo('.topo-nav a, .topo-dir > *', { y: -14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6, stagger: .05, clearProps: 'all' }, .35)
      .to('.zap', { autoAlpha: 1, duration: .6 }, .8);
    if (heroFoto) chegada.fromTo(heroFoto, { scale: 1.22 }, { scale: 1.06, duration: 2.2, ease: 'power3.out' }, 0);
    const abrir = gsap.timeline();
    if (estreia) {
      const conta = { v: 0 }, num = $('.intro-num');
      abrir.to(conta, { v: 100, duration: 1.05, ease: 'power2.inOut', onUpdate: () => { if (num) num.textContent = String(Math.round(conta.v)).padStart(2, '0'); } }, 0)
        .to('.intro-barra i', { scaleX: 1, duration: 1.05, ease: 'power2.inOut' }, 0)
        .from('.intro-miolo img', { autoAlpha: 0, y: 18, duration: .6 }, 0)
        .to('.intro-miolo, .intro-num', { autoAlpha: 0, y: -24, duration: .3, ease: 'power2.in' }, 1.08);
      try { sessionStorage.setItem('hg-visto', '1'); } catch (e) {}
    }
    abrir.to('.intro-col', { yPercent: -101, duration: estreia ? .9 : .6, stagger: estreia ? .07 : .04, ease: 'power4.inOut' }, estreia ? 1.2 : .05)
      .add(() => chegada.play(), estreia ? 1.45 : .2)
      .set('.intro', { display: 'none' });

    /* saída: a cortina desce e a navegação acontece */
    const interno = (a) => {
      const h = a.getAttribute('href') || '';
      if (!h || h.charAt(0) === '#' || a.target === '_blank' || a.hasAttribute('download') || /^(https?:|mailto:|tel:|sms:)/i.test(h)) return false;
      return /\.html(#.*)?$/i.test(h) || /\/$/.test(h);
    };
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      if (!interno(a)) return;
      const destino = a.href; if (destino.split('#')[0] === location.href.split('#')[0]) return;
      e.preventDefault();
      html.classList.add('saindo'); html.classList.remove('estreia');
      gsap.killTweensOf('.intro-col');
      gsap.set('.intro', { display: 'block', visibility: 'visible' });
      gsap.fromTo('.intro-col', { yPercent: 101 }, { yPercent: 0, duration: .45, stagger: .03, ease: 'power3.inOut', onComplete: () => { location.href = destino; } });
      setTimeout(() => { location.href = destino; }, 900);
    });
    window.addEventListener('pageshow', (e) => { if (e.persisted) { html.classList.remove('saindo'); gsap.set('.intro', { display: 'none' }); gsap.set('.topo, .zap', { autoAlpha: 1 }); gsap.set('.topo-nav a, .topo-dir > *', { clearProps: 'all' }); } });

    /* ── Hero ao rolar: foto em paralaxe, luz segue o cursor ── */
    if ($('.hero')) {
      gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: SCRUB } })
        .to('.hero-foto', { yPercent: 9, ease: 'none', duration: 1 }, 0)
        .to('.hero-in', { y: -60, ease: 'none', duration: 1 }, 0)
        .to('.hero-in', { opacity: 0, ease: 'none', duration: .45 }, .5);
      if (fino && luz) {
        const lx = gsap.quickTo(luz, 'x', { duration: .9, ease: 'power3' }), ly = gsap.quickTo(luz, 'y', { duration: .9, ease: 'power3' });
        const hero = $('.hero');
        hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); lx(e.clientX - r.left); ly(e.clientY - r.top); });
      }
    }

    /* ── Letreiros: andam sozinhos e aceleram com o scroll; fora da tela ficam parados ── */
    let vel = 0, velS = 0, sentido = 1, mqs = [];
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { vel = s.getVelocity(); sentido = s.direction || 1; } });
    const olho = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((x) => { x.target._vis = x.isIntersecting; }), { rootMargin: '80px' }) : null;
    function montarLetreiros() {
      mqs.forEach((m) => { m.t.innerHTML = m.base; });
      mqs = $$('.mq[data-mq]').map((box) => {
        const t = $('.mq-t', box), base = (box._base = box._base || t.innerHTML);
        t.innerHTML = base;
        const unidade = t.getBoundingClientRect().width || 1;
        const n = Math.ceil((innerWidth * 1.2) / unidade) + 1;
        t.innerHTML = base + ('<span class="mq-c" aria-hidden="true" style="display:contents">' + base + '</span>').repeat(n);
        $$('.mq-c a', t).forEach((a) => { a.tabIndex = -1; });
        if (olho && !box._obs) { box._obs = true; box._vis = true; olho.observe(box); }
        if (box.dataset.pausa && !box._ouv) { box._ouv = true; box.addEventListener('pointerenter', () => { box._p = true; }); box.addEventListener('pointerleave', () => { box._p = false; }); }
        return { box, t, base, unidade, x: 0, k: 1, dir: +box.dataset.mq || 1, fixo: !!box.dataset.fixo };
      });
    }
    gsap.ticker.add((t, dt) => {
      const f = Math.min(dt, 50) / 16.67;
      velS += (vel - velS) * .1; vel *= .9;
      const impulso = Math.min(Math.abs(velS) / 260, 9);
      /* tombo: inclinação sutil pela velocidade do scroll; volta a zero quando a rolagem assenta */
      const tombo = Math.max(-4.5, Math.min(4.5, velS / 190));
      for (const m of mqs) {
        if (m.box._vis === false) continue;
        m.k += ((m.box._p ? 0 : 1) - m.k) * .08;
        m.x -= m.dir * (m.fixo ? 1 : sentido) * (.7 + (m.fixo ? impulso * .35 : impulso)) * m.k * f;
        m.x = ((m.x % m.unidade) - m.unidade) % m.unidade;
        m.t.style.transform = 'translate3d(' + m.x.toFixed(2) + 'px,0,0) skewX(' + (m.fixo ? tombo * .4 : tombo).toFixed(2) + 'deg)';
      }
    });

    /* ── Números fantasma em paralaxe; seções claras chegam como cartão que se abre ── */
    $$('[data-par]').forEach((e) => gsap.fromTo(e, { yPercent: -14 }, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: e.parentElement, start: 'top bottom', end: 'bottom top', scrub: SCRUB } }));
    $$('.sec.clara').forEach((sc) => gsap.fromTo(sc, { clipPath: 'inset(0% 4% 0% 4% round 2.5rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 0rem)', ease: 'none', scrollTrigger: { trigger: sc, start: 'top bottom', end: 'top 40%', scrub: SCRUB } }));

    /* ── Formas de pagamento: o capítulo que passa pelo meio da tela troca a tela do aparelho (sem pin) ── */
    const mm = gsap.matchMedia();
    $$('.pg').forEach((pg) => {
      const passos = $$('.passo', pg), telas = $$('.pg-cel .tela', pg), navs = $$('.pg-nav button', pg), fant = $('.pg-fant', pg), cel = $('.pg-cel .cel', pg), c3d = $('.pg-cel .cel-3d', pg);
      if (!passos.length || !cel) return;
      mm.add('(min-width: 1024px)', () => {
        let atual = -1;
        function irPasso(i, d) {
          if (i === atual) return; atual = i;
          passos.forEach((p, k) => p.classList.toggle('on', k === i));
          telas.forEach((t, k) => {
            if (k === i) {
              t.classList.add('on'); gsap.set(t, { zIndex: 2 });
              gsap.fromTo(t, { autoAlpha: 0, yPercent: 8 * d }, { autoAlpha: 1, yPercent: 0, duration: .6, overwrite: true });
              const tk = $$('.t-ticks i', t);
              if (tk.length) gsap.fromTo(tk, { scaleY: .2, opacity: .25 }, { scaleY: 1, opacity: 1, duration: .4, stagger: Math.min(.03, .8 / tk.length), delay: .2, ease: 'back.out(2)', overwrite: true });
              const b = $('.wc-barra i', t); if (b) gsap.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 1.1, delay: .3, ease: 'power2.out', overwrite: true });
              gsap.fromTo($$('.t-w, .t-chips span, .t-cta', t), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .45, stagger: .05, delay: .25, overwrite: true });
            } else { gsap.set(t, { zIndex: 1 }); gsap.to(t, { autoAlpha: 0, yPercent: -6 * d, duration: .3, overwrite: true, onComplete: () => t.classList.remove('on') }); }
          });
          navs.forEach((b, k) => { b.classList.toggle('on', k === i); });
          if (fant) gsap.to(fant, { autoAlpha: 0, duration: .14, overwrite: true, onComplete: () => { fant.textContent = passos[i].dataset.num || ''; gsap.to(fant, { autoAlpha: 1, duration: .5 }); } });
        }
        const sts = passos.map((p, i) => ScrollTrigger.create({ trigger: p, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) irPasso(i, s.direction || 1); } }));
        irPasso(0, 1);
        const gira = gsap.fromTo(c3d, { rotationY: -22, rotationX: 7 }, { rotationY: 18, rotationX: -4, ease: 'none', scrollTrigger: { trigger: $('.pg-caps', pg), start: 'top 70%', end: 'bottom 40%', scrub: SCRUB } });
        const flutua = gsap.to(cel, { y: -10, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true });
        const vista = ScrollTrigger.create({ trigger: pg, start: 'top bottom', end: 'bottom top', onToggle: (s) => { if (s.isActive) flutua.play(); else flutua.pause(); } });
        const cliques = navs.map((b, k) => { const fn = () => irPara(passos[k], -innerHeight * .28); b.addEventListener('click', fn); return fn; });
        return () => { sts.forEach((s) => s.kill()); vista.kill(); flutua.kill(); if (gira.scrollTrigger) gira.scrollTrigger.kill(); gira.kill(); navs.forEach((b, k) => b.removeEventListener('click', cliques[k])); passos.forEach((p) => p.classList.add('on')); gsap.set(telas, { clearProps: 'all' }); telas.forEach((t, k) => t.classList.toggle('on', k === 0)); };
      });
      mm.add('(max-width: 1023px)', () => { passos.forEach((p) => p.classList.add('on')); });
    });
    /* aparelho isolado das páginas de forma: inclina com o scroll */
    $$('.cel-solo').forEach((box) => {
      const c = $('.cel-3d', box); if (!c) return;
      gsap.fromTo(c, { rotationY: -18, rotationX: 6 }, { rotationY: 14, rotationX: -3, ease: 'none', scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: SCRUB } });
      const tk = $$('.t-ticks i', box);
      if (tk.length) gsap.from(tk, { scaleY: .2, opacity: .25, duration: .4, stagger: Math.min(.03, .8 / tk.length), ease: 'back.out(2)', scrollTrigger: { trigger: box, start: 'top 75%', once: true } });
    });

    /* ── Etapas: a linha desce e acende cada uma ── */
    $$('.etapas').forEach((lista) => {
      const fio = $('.trilho i', lista);
      if (fio) gsap.fromTo(fio, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: lista, start: 'top 68%', end: 'bottom 62%', scrub: SCRUB } });
      $$('.etapa', lista).forEach((e) => ScrollTrigger.create({ trigger: e, start: 'top 66%', onEnter: () => e.classList.add('on'), onLeaveBack: () => e.classList.remove('on') }));
    });

    /* ── Mapa: alfinetes caem, o mapa inclina com o cursor, as lojas se revezam até alguém tocar ── */
    (function () {
      const caixa = $('#ljMapa'), m3d = $('.lj-mapa-3d'); if (!caixa || !m3d) return;
      const svg = $('svg', caixa), secao = caixa.closest('.sec') || caixa; if (!svg) return;
      gsap.set($$('.alfinete', svg), { autoAlpha: 0, y: -46 });
      gsap.set(m3d, { autoAlpha: 0, y: 40, rotationX: 14 });
      let ciclo = null, i = 0;
      ScrollTrigger.create({ trigger: caixa, start: 'top 80%', once: true, onEnter: () => {
        gsap.to(m3d, { autoAlpha: 1, y: 0, rotationX: 0, duration: 1.2, ease: ENTRADA });
        gsap.to($$('.alfinete', svg), { autoAlpha: 1, y: 0, duration: .8, stagger: .07, ease: 'bounce.out', delay: .3 });
      } });
      ScrollTrigger.create({ trigger: secao, start: 'top 60%', end: 'bottom 40%', onToggle: (s) => {
        clearInterval(ciclo);
        if (s.isActive && !lojaMexeu && ativarLoja) ciclo = setInterval(() => { if (lojaMexeu) return clearInterval(ciclo); i = (i + 1) % LOJAS.length; ativarLoja(LOJAS[i].id); }, 3600);
      } });
      if (fino) {
        const rx = gsap.quickTo(m3d, 'rotationX', { duration: .8, ease: 'power3' }), ry = gsap.quickTo(m3d, 'rotationY', { duration: .8, ease: 'power3' });
        caixa.addEventListener('pointermove', (e) => { const r = caixa.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 8); rx(-((e.clientY - r.top) / r.height - .5) * 8); });
        caixa.addEventListener('pointerleave', () => { rx(0); ry(0); });
      }
    })();

    /* ── Chamada final: o texto vazado enche de azul ── */
    $$('.cta').forEach((c) => { const e = $$('.enche', c); if (e.length) gsap.to(e, { backgroundSize: '100% 100%', ease: 'none', stagger: .45, scrollTrigger: { trigger: c, start: 'top 80%', end: 'center 45%', scrub: SCRUB } }); });
    $$('.rodape-marca').forEach((m) => gsap.fromTo(m, { xPercent: 4 }, { xPercent: -4, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: SCRUB } }));

    /* ── Magnetismo: botões atraem o cursor e voltam com mola; cartões inclinam ── */
    if (fino) {
      $$('.btn, .menu-b, .vt-setas button, .zap').forEach((el) => {
        el.classList.add('ima');
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .26, y: (e.clientY - r.top - r.height / 2) * .34, duration: .4, ease: 'power3.out', overwrite: 'auto' });
        });
        el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: .75, ease: 'elastic.out(1,.45)', overwrite: 'auto' }));
      });
      $$('a.cartao, .cartao-link').forEach((c) => {
        c.classList.add('ima');
        c.addEventListener('pointermove', (e) => {
          const r = c.getBoundingClientRect();
          gsap.to(c, { rotationY: ((e.clientX - r.left) / r.width - .5) * 7, rotationX: -((e.clientY - r.top) / r.height - .5) * 7, y: -4, transformPerspective: 700, duration: .45, ease: 'power3.out', overwrite: 'auto' });
        });
        c.addEventListener('pointerleave', () => gsap.to(c, { rotationY: 0, rotationX: 0, y: 0, duration: .7, ease: 'power3.out', overwrite: 'auto' }));
      });
    }

    /* ── Cursor ── */
    if (fino) {
      const cur = $('.cursor');
      if (cur) {
        const cx = gsap.quickTo(cur, 'x', { duration: .22, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: .22, ease: 'power3' });
        window.addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); cur.classList.add('vis'); cur.classList.toggle('ativo', !!(e.target.closest && e.target.closest('a,button,.alfinete,select,input,textarea'))); });
        document.addEventListener('pointerleave', () => cur.classList.remove('vis'));
      }
    }

    /* ── Medidas dependem da fonte e das imagens ── */
    const refazer = () => { montarLetreiros(); ScrollTrigger.refresh(); };
    montarLetreiros();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refazer);
    window.addEventListener('load', refazer);
    let larg = innerWidth, tmr;
    window.addEventListener('resize', () => { if (innerWidth === larg) return; larg = innerWidth; clearTimeout(tmr); tmr = setTimeout(refazer, 200); });
    html.classList.add('pronto');
  } catch (erro) {
    /* Qualquer falha na camada de movimento devolve a página estática e legível. */
    try { ScrollTrigger.getAll().forEach((t) => t.kill()); gsap.globalTimeline.clear(); } catch (e) {}
    html.classList.remove('motion-ok', 'estreia', 'saindo');
    $$('*').forEach((n) => { if (n.style && n.style.cssText && /(opacity|visibility|transform|translate|rotate|scale|clip-path)/.test(n.style.cssText)) n.style.cssText = n.style.cssText.replace(/(opacity|visibility|transform|translate|rotate|scale|clip-path)\s*:[^;]*;?/g, ''); });
    $$('.etapa, .passo').forEach((e) => e.classList.add('on'));
    $$('.tela').forEach((t, i) => t.classList.toggle('on', i === 0));
    if (window.console) console.error(erro);
  }
})();
