/* =========================================================
   Decolagem na chamada final
   ---------------------------------------------------------
   O vídeo avança conforme o visitante rola a página e volta
   quando ele rola para cima. Regras seguidas:
   - o vídeo só é baixado quando a seção se aproxima da tela;
   - ele é baixado inteiro (Blob), o que funciona mesmo em
     hospedagens que não aceitam download parcial;
   - a posição exibida é suavizada num laço que descansa
     quando chega ao destino ou quando a seção sai da tela;
   - nunca há duas buscas de quadro ao mesmo tempo;
   - celulares, tablets em pé e movimento reduzido recebem a
     imagem fixa (os mesmos cinco portões do CSS);
   - se o vídeo falhar, a imagem fixa assume e a página segue
     completa.
   ========================================================= */
(function () {
  'use strict';

  var secao = document.getElementById('chamada');
  if (!secao) return;

  /* O primeiro formato que o navegador reproduzir é o usado */
  var FONTES = [
    { url: 'assets/video/decolagem.mp4?v=1', tipo: 'video/mp4; codecs="avc1.64001F"' },
    { url: 'assets/video/decolagem.webm?v=1', tipo: 'video/webm; codecs="vp9"' }
  ];
  var POSTER_URL = 'assets/img/decolagem-inicio.jpg';

  /* Idênticos, caractere por caractere, às media queries do CSS */
  var PORTOES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];

  var palco = secao.querySelector('.chamada__palco');
  var video = secao.querySelector('.chamada__video');
  var poster = secao.querySelector('.chamada__poster');
  var cabecalho = document.getElementById('cabecalho');

  function limitar(v, min, max) { return Math.min(max, Math.max(min, v)); }

  /* ---------- Título dividido em palavras para a entrada ---------- */
  var titulo = secao.querySelector('[data-subida]');
  if (titulo) {
    var frase = titulo.textContent.trim();
    var palavras = frase.split(/\s+/);
    titulo.textContent = '';
    var leitor = document.createElement('span');
    leitor.className = 'sr-only';
    leitor.textContent = frase;                       // leitores de tela leem a frase inteira
    var visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    palavras.forEach(function (p, i) {
      var w = document.createElement('span');
      w.className = 'w';
      w.textContent = p;
      w.style.setProperty('--th', (i / palavras.length * 0.45).toFixed(3));
      visual.appendChild(w);
      if (i < palavras.length - 1) visual.appendChild(document.createTextNode(' '));
    });
    titulo.appendChild(leitor);
    titulo.appendChild(visual);
  }

  /* ---------- Progresso da rolagem: 0 quando a seção aparece embaixo,
     1 quando o topo dela chega logo abaixo do cabeçalho ---------- */
  function progresso() {
    var r = palco.getBoundingClientRect();
    var vh = window.innerHeight;
    var topoUtil = cabecalho ? cabecalho.getBoundingClientRect().bottom : 0;
    return limitar((vh - r.top) / Math.max(1, vh - topoUtil), 0, 1);
  }

  /* ---------- Escritas no DOM só quando algo muda ---------- */
  var kAtual = -1;
  function aplicarTexto(p) {
    var k = limitar((p - 0.1) / 0.62, 0, 1);
    if (Math.abs(k - kAtual) < 0.008 && k !== 0 && k !== 1) return;
    if (k === kAtual) return;
    kAtual = k;
    secao.style.setProperty('--k', k.toFixed(3));
  }

  /* ---------- Buscas de quadro travadas (nunca duas ao mesmo tempo) ---------- */
  var buscando = false;
  var tempoPendente = null;
  function pedirQuadro(t) {
    if (!video.duration || !isFinite(video.duration)) return;
    if (buscando) { tempoPendente = t; return; }
    buscando = true;
    video.currentTime = t;
  }
  video.addEventListener('seeked', function () {
    buscando = false;
    if (tempoPendente !== null) {
      var t = tempoPendente;
      tempoPendente = null;
      pedirQuadro(t);
    }
  });
  video.addEventListener('error', function () {      // saída de emergência da trava
    buscando = false;
    tempoPendente = null;
    falhar();
  });

  /* ---------- Laço suavizado que descansa ---------- */
  var alvo = 0;
  var mostrado = 0;
  var idQuadro = null;
  var ultimoTick = 0;
  var naTela = false;

  function tick(agora) {
    var dt = Math.min(100, agora - (ultimoTick || agora));
    ultimoTick = agora;
    alvo = progresso();
    var suavidade = 0.16;                             // por quadro, a 60 quadros por segundo
    mostrado += (alvo - mostrado) * (1 - Math.pow(1 - suavidade, dt / 16.667));
    if (Math.abs(alvo - mostrado) < 0.0005) {
      mostrado = alvo;
      idQuadro = null;
      ultimoTick = 0;                                 // chegou: o laço descansa
    } else {
      idQuadro = window.requestAnimationFrame(tick);
    }
    if (pronto) pedirQuadro(mostrado * video.duration);
    aplicarTexto(mostrado);
  }

  function aoRolar() {
    if (idQuadro === null && naTela) idQuadro = window.requestAnimationFrame(tick);
  }

  /* ---------- Carregamento do vídeo (uma vez, só no modo com vídeo) ---------- */
  var iniciado = false;
  var pronto = false;
  var falhou = false;

  function falhar() {
    if (falhou) return;
    falhou = true;
    secao.classList.add('video-falhou');              // a imagem fixa assume
    secao.classList.remove('video-pronto');
  }

  function carregarVideo() {
    if (iniciado) return;
    iniciado = true;
    poster.style.backgroundImage = "url('" + POSTER_URL + "')";
    var fonte = FONTES.filter(function (f) { return video.canPlayType(f.tipo) !== ''; })[0];
    if (!fonte) { falhar(); return; }
    var controle = 'AbortController' in window ? new AbortController() : null;
    var vigia = controle ? window.setTimeout(function () { controle.abort(); }, 20000) : null;
    fetch(fonte.url, { priority: 'low', signal: controle ? controle.signal : undefined })
      .then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        return r.blob();
      })
      .then(function (blob) {
        if (vigia) window.clearTimeout(vigia);
        video.src = URL.createObjectURL(blob);
        video.load();
        video.addEventListener('loadeddata', function () {
          pronto = true;
          mostrado = alvo = progresso();
          pedirQuadro(mostrado * video.duration);     // pousa na posição atual da rolagem
          secao.classList.add('video-pronto');
        }, { once: true });
      })
      .catch(function () {
        if (vigia) window.clearTimeout(vigia);
        falhar();
      });
  }

  /* Começa a baixar quando a seção está a cerca de uma tela de distância */
  var observadorPerto = null;
  var observadorTela = null;
  if ('IntersectionObserver' in window) {
    observadorPerto = new IntersectionObserver(function (entradas) {
      if (entradas[0].isIntersecting && modoVideo) carregarVideo();
    }, { rootMargin: '100% 0px 100% 0px' });
    observadorTela = new IntersectionObserver(function (entradas) {
      naTela = entradas[0].isIntersecting;
      if (naTela) aoRolar();
    });
  }

  /* A imagem fixa (celular, movimento reduzido) também só é baixada perto da seção */
  if ('IntersectionObserver' in window) {
    var observadorImagem = new IntersectionObserver(function (entradas, obs) {
      if (entradas[0].isIntersecting) { secao.classList.add('perto'); obs.disconnect(); }
    }, { rootMargin: '100% 0px 100% 0px' });
    observadorImagem.observe(palco);
  } else {
    secao.classList.add('perto');
  }

  /* ---------- Portões vivos: liga e desliga o modo com vídeo ---------- */
  var modoVideo = false;

  function ligarVideo() {
    if (modoVideo) return;
    modoVideo = true;
    kAtual = -1;                                      // reseta o cache para reescrever o estado
    window.addEventListener('scroll', aoRolar, { passive: true });
    window.addEventListener('resize', aoRolar, { passive: true });
    if (observadorPerto) {
      observadorPerto.observe(palco);
      observadorTela.observe(palco);
    } else {
      naTela = true;
      carregarVideo();
    }
    mostrado = alvo = progresso();
    aplicarTexto(mostrado);
    if (pronto) pedirQuadro(mostrado * video.duration);
  }

  function desligarVideo() {
    if (!modoVideo) return;
    modoVideo = false;
    window.removeEventListener('scroll', aoRolar);
    window.removeEventListener('resize', aoRolar);
    if (observadorPerto) { observadorPerto.disconnect(); observadorTela.disconnect(); }
    if (idQuadro !== null) { window.cancelAnimationFrame(idQuadro); idQuadro = null; }
    secao.style.removeProperty('--k');               // estado final: texto todo visível
    kAtual = -1;
  }

  function aplicarModo() {
    var fixo = PORTOES.some(function (q) { return window.matchMedia(q).matches; });
    if (fixo) desligarVideo(); else ligarVideo();
  }

  /* Mantém as listas referenciadas para os avisos de mudança não se perderem */
  var listas = PORTOES.map(function (q) { return window.matchMedia(q); });
  listas.forEach(function (m) {
    if (m.addEventListener) m.addEventListener('change', aplicarModo);
    else if (m.addListener) m.addListener(aplicarModo);
  });
  aplicarModo();
})();
