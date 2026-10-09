/* =========================================================
   Comportamentos gerais da página
   - cabeçalho fixo e menu do celular
   - destaque do item de menu da seção visível
   - entradas suaves das seções e animação da rede
   - lista de setores com opção de expandir
   - botões que levam ao contato já com a solução escolhida
   - canais oficiais, WhatsApp e Política de Privacidade (via config.js)
   ========================================================= */
(function () {
  'use strict';

  var Index = (window.Index = window.Index || {});
  var CONFIG = window.INDEX_CONFIG || {};
  var movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  var telaGrande = window.matchMedia('(min-width: 1024px)');

  function $(seletor, raiz) { return (raiz || document).querySelector(seletor); }
  function $$(seletor, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(seletor)); }

  /* ---------- Ano atual no rodapé ---------- */
  $$('[data-ano]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Cabeçalho: sombra discreta depois que a página rola ---------- */
  var cabecalho = $('#cabecalho');
  var cabecalhoRolado = null;
  var quadroAgendado = false;
  function atualizarCabecalho() {
    quadroAgendado = false;
    var rolado = window.scrollY > 8;
    if (rolado !== cabecalhoRolado) {          // só toca no DOM quando muda
      cabecalhoRolado = rolado;
      cabecalho.classList.toggle('rolado', rolado);
    }
  }
  window.addEventListener('scroll', function () {
    if (!quadroAgendado) { quadroAgendado = true; window.requestAnimationFrame(atualizarCabecalho); }
  }, { passive: true });
  atualizarCabecalho();

  /* ---------- Menu do celular ---------- */
  var botaoMenu = $('.nav__alternar');
  var painelMenu = $('#menu-principal');
  var textoMenu = $('.nav__alternar-texto');

  function menuAberto() { return botaoMenu.getAttribute('aria-expanded') === 'true'; }

  function abrirMenu() {
    botaoMenu.setAttribute('aria-expanded', 'true');
    textoMenu.textContent = 'Fechar';
    painelMenu.classList.add('aberto');
    var primeiro = $('a', painelMenu);
    if (primeiro) primeiro.focus({ preventScroll: true });
  }
  function fecharMenu(devolverFoco) {
    if (!menuAberto()) return;
    botaoMenu.setAttribute('aria-expanded', 'false');
    textoMenu.textContent = 'Menu';
    painelMenu.classList.remove('aberto');
    if (devolverFoco) botaoMenu.focus();
  }

  botaoMenu.addEventListener('click', function () {
    if (menuAberto()) fecharMenu(false); else abrirMenu();
  });
  painelMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) fecharMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuAberto()) fecharMenu(true);
  });
  document.addEventListener('click', function (e) {
    if (menuAberto() && !e.target.closest('.nav')) fecharMenu(false);
  });
  /* Mantém o foco do teclado dentro do menu aberto */
  painelMenu.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !menuAberto() || telaGrande.matches) return;
    var focaveis = $$('a, button', painelMenu).concat([botaoMenu]);
    var primeiro = focaveis[0];
    var ultimo = focaveis[focaveis.length - 2];
    if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); botaoMenu.focus(); }
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); botaoMenu.focus(); }
  });
  telaGrande.addEventListener('change', function (e) { if (e.matches) fecharMenu(false); });

  /* ---------- Item de menu da seção visível ---------- */
  var linksMenu = $$('.nav__link');
  var secoesMenu = linksMenu
    .map(function (link) { return document.getElementById(link.getAttribute('href').slice(1)); })
    .filter(Boolean);
  var secaoAtual = null;

  function marcarSecao(id) {
    if (id === secaoAtual) return;
    secaoAtual = id;
    linksMenu.forEach(function (link) {
      if (link.getAttribute('href') === '#' + id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window) {
    var visiveis = {};
    var observadorSecoes = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) { visiveis[entrada.target.id] = entrada.isIntersecting; });
      /* A seção ativa é a última (na ordem da página) que cruza a faixa de leitura */
      var ativa = null;
      secoesMenu.forEach(function (secao) { if (visiveis[secao.id]) ativa = secao.id; });
      if (ativa) marcarSecao(ativa);
    }, { rootMargin: '-35% 0px -55% 0px' });
    secoesMenu.forEach(function (secao) { observadorSecoes.observe(secao); });
  }

  /* ---------- Entradas suaves ---------- */
  $$('.revelar-grupo').forEach(function (grupo) {
    Array.prototype.forEach.call(grupo.children, function (filho, i) { filho.style.setProperty('--i', i); });
  });

  function revelar(el) {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    if (el.classList.contains('revelar-grupo')) {
      /* Depois que o último item entra, os atrasos escalonados são aposentados */
      var total = (el.children.length - 1) * 90 + 800;
      window.setTimeout(function () { el.classList.add('assentado'); }, total);
    }
  }

  var elementosRevelar = $$('.revelar, .revelar-grupo');
  if (!('IntersectionObserver' in window) || movimentoReduzido.matches) {
    elementosRevelar.forEach(revelar);
  } else {
    var observadorEntrada = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) { revelar(entrada.target); obs.unobserve(entrada.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    elementosRevelar.forEach(function (el) { observadorEntrada.observe(el); });
  }
  /* Se o movimento reduzido for ligado com a página aberta, tudo aparece no estado final */
  movimentoReduzido.addEventListener('change', function (e) {
    if (e.matches) elementosRevelar.forEach(revelar);
  });

  /* ---------- Rede de conexões da primeira tela ---------- */
  var rede = $('.rede');
  if (rede) {
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { rede.classList.add('in'); });
    });
    /* Os pulsos só começam depois que as linhas terminam de se desenhar */
    window.setTimeout(function () { rede.classList.add('assentada'); }, 2300);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        rede.classList.toggle('visivel', entradas[0].isIntersecting);   // pausa fora da tela
      }).observe(rede);
    } else {
      rede.classList.add('visivel');
    }
  }

  /* Pausa todas as animações quando a aba fica escondida */
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('pausado', document.hidden);
  });

  /* ---------- Setores: mostra os 12 primeiros e permite expandir ---------- */
  var listaSetores = $('#lista-setores');
  var botaoSetores = $('.setores__alternar');
  var LIMITE_SETORES = 12;
  if (listaSetores && botaoSetores && listaSetores.children.length > LIMITE_SETORES) {
    var textoSetores = $('.setores__alternar-texto', botaoSetores);
    listaSetores.classList.add('recolhida');
    botaoSetores.hidden = false;
    botaoSetores.addEventListener('click', function () {
      var expandir = botaoSetores.getAttribute('aria-expanded') !== 'true';
      botaoSetores.setAttribute('aria-expanded', String(expandir));
      listaSetores.classList.toggle('recolhida', !expandir);
      textoSetores.textContent = expandir ? 'Mostrar menos setores' : 'Ver todos os setores';
      if (!expandir) {
        /* Ao recolher, mantém o botão à vista */
        botaoSetores.scrollIntoView({ block: 'nearest', behavior: movimentoReduzido.matches ? 'auto' : 'smooth' });
      }
    });
  }

  /* ---------- Chamadas para contato: preservam a solução escolhida ---------- */
  var selectObjetivo = $('#objetivo');

  function selecionarObjetivo(valor) {
    if (!selectObjetivo || !valor) return;
    var existe = $$('option', selectObjetivo).some(function (op) { return op.value === valor; });
    if (!existe) return;
    selectObjetivo.value = valor;
    selectObjetivo.dispatchEvent(new Event('change', { bubbles: true }));
    var campo = selectObjetivo.closest('.campo');
    if (campo) {
      campo.classList.remove('preenchido-pela-solucao');
      void campo.offsetWidth;                      // reinicia o destaque
      campo.classList.add('preenchido-pela-solucao');
    }
  }
  Index.selecionarObjetivo = selecionarObjetivo;

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href="#contato"]');
    if (!link) return;
    if (link.hasAttribute('data-objetivo')) selecionarObjetivo(link.getAttribute('data-objetivo'));
    if (link.hasAttribute('data-cta') && Index.medir) {
      Index.medir('cliqueContato', {
        origem: link.getAttribute('data-cta'),
        objetivo: link.getAttribute('data-objetivo') || ''
      });
    }
  });

  /* Links externos podem chegar com ?objetivo=estruturacao#contato */
  try {
    var objetivoUrl = new URLSearchParams(window.location.search).get('objetivo');
    if (objetivoUrl) selecionarObjetivo(objetivoUrl);
  } catch (e) { /* sem suporte a URLSearchParams: ignora */ }

  /* ---------- Canais oficiais (somente os configurados) ---------- */
  var contato = CONFIG.contato || {};

  function limpar(texto) { return typeof texto === 'string' ? texto.trim() : ''; }
  function urlSegura(url) { return /^https:\/\/[^\s]+$/i.test(limpar(url)); }

  var email = limpar(contato.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) email = '';
  var telefone = limpar(contato.telefone);
  var telefoneDigitos = telefone.replace(/\D/g, '');
  if (telefoneDigitos.length < 8) telefone = '';
  var whatsapp = limpar(contato.whatsapp).replace(/\D/g, '');
  if (whatsapp.length < 10 || whatsapp.length > 15) whatsapp = '';
  var endereco = limpar(contato.endereco);
  var redes = (Array.isArray(CONFIG.redesSociais) ? CONFIG.redesSociais : []).filter(function (r) {
    return r && limpar(r.nome) && urlSegura(r.url);
  });

  var linkWhatsapp = whatsapp
    ? 'https://wa.me/' + whatsapp + (contato.mensagemWhatsapp ? '?text=' + encodeURIComponent(contato.mensagemWhatsapp) : '')
    : '';

  /* Usado pelo formulário para sugerir outro canal quando o envio falha */
  Index.canais = { email: email, linkWhatsapp: linkWhatsapp };

  function criarIcone(id, preenchido) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'icone' + (preenchido ? ' icone--preenchido' : ''));
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS(ns, 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  }

  function itensCanais() {
    var itens = [];
    if (email) itens.push({ icone: 'i-mail', texto: email, href: 'mailto:' + email, rotulo: 'E-mail: ' + email });
    if (telefone) itens.push({ icone: 'i-phone', texto: telefone, href: 'tel:' + (telefone.charAt(0) === '+' ? '+' : '') + telefoneDigitos, rotulo: 'Telefone: ' + telefone });
    if (linkWhatsapp) itens.push({ icone: 'i-whatsapp', preenchido: true, texto: 'WhatsApp', href: linkWhatsapp, externo: true, whatsapp: true, rotulo: 'Conversar pelo WhatsApp (abre em nova aba)' });
    if (endereco) itens.push({ icone: 'i-map-pin', texto: endereco });
    redes.forEach(function (r) {
      itens.push({ icone: 'i-arrow-up-right', texto: limpar(r.nome), href: limpar(r.url), externo: true, rotulo: limpar(r.nome) + ' (abre em nova aba)' });
    });
    return itens;
  }

  function preencherLista(lista, classeItem, origem) {
    var itens = itensCanais();
    itens.forEach(function (item) {
      var li = document.createElement('li');
      var el = document.createElement(item.href ? 'a' : 'span');
      el.className = classeItem;
      if (item.href) {
        el.href = item.href;
        if (item.rotulo) el.setAttribute('aria-label', item.rotulo);
        if (item.externo) { el.target = '_blank'; el.rel = 'noopener'; }
        if (item.whatsapp) el.setAttribute('data-whatsapp', origem);
      }
      el.appendChild(criarIcone(item.icone, item.preenchido));
      el.appendChild(document.createTextNode(item.texto));
      li.appendChild(el);
      lista.appendChild(li);
    });
    return itens.length;
  }

  var blocoCanais = $('[data-canais]');
  if (blocoCanais && preencherLista($('[data-canais-lista]'), 'canal', 'contato')) blocoCanais.hidden = false;
  var blocoCanaisRodape = $('[data-canais-rodape]');
  if (blocoCanaisRodape && preencherLista($('[data-canais-rodape-lista]'), '', 'rodape')) blocoCanaisRodape.hidden = false;

  /* ---------- Política de Privacidade (quando houver URL) ---------- */
  var privacidade = CONFIG.privacidade || {};
  var urlPrivacidade = limpar(privacidade.url);
  if (urlPrivacidade && (urlSegura(urlPrivacidade) || /^[\w\-./]+\.html?$/i.test(urlPrivacidade))) {
    var rodapePrivacidade = $('[data-privacidade-rodape]');
    var formPrivacidade = $('[data-privacidade-form]');
    var linkPrivacidadeForm = $('[data-privacidade-link]');
    if (rodapePrivacidade) { rodapePrivacidade.href = urlPrivacidade; rodapePrivacidade.hidden = false; }
    if (formPrivacidade && linkPrivacidadeForm) { linkPrivacidadeForm.href = urlPrivacidade; formPrivacidade.hidden = false; }
  }

  /* ---------- Botão flutuante de WhatsApp ---------- */
  var flutuante = $('[data-whatsapp-flutuante]');
  if (flutuante && linkWhatsapp) {
    flutuante.href = linkWhatsapp;
    flutuante.setAttribute('data-whatsapp', 'flutuante');
    flutuante.hidden = false;

    /* Aparece depois da primeira tela, para não pedir contato antes de o visitante
       conhecer a Index, e se recolhe quando o formulário está na tela */
    var passouPrimeiraTela = false;
    var formularioNaTela = false;
    var estadoFlutuante = null;
    function atualizarFlutuante() {
      var mostrar = passouPrimeiraTela && !formularioNaTela;
      if (mostrar === estadoFlutuante) return;
      estadoFlutuante = mostrar;
      flutuante.classList.toggle('visivel', mostrar);
      if (mostrar) flutuante.removeAttribute('tabindex'); else flutuante.setAttribute('tabindex', '-1');
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        var e = entradas[0];
        passouPrimeiraTela = !e.isIntersecting && e.boundingClientRect.top < 0;
        atualizarFlutuante();
      }, { threshold: 0, rootMargin: '0px 0px -40% 0px' }).observe($('#inicio'));
      new IntersectionObserver(function (entradas) {
        formularioNaTela = entradas[0].isIntersecting;
        atualizarFlutuante();
      }).observe($('#form-contato').closest('.contato__painel'));
    } else {
      passouPrimeiraTela = true;
      atualizarFlutuante();
    }
  }

  /* ---------- Medição de cliques no WhatsApp ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-whatsapp]');
    if (link && Index.medir) Index.medir('cliqueWhatsapp', { origem: link.getAttribute('data-whatsapp') });
  });
})();
