/* =========================================================
   Pontos de medição
   ---------------------------------------------------------
   Index.medir(nome, dados) registra um evento. Enquanto a
   medição estiver desligada em config.js, nada é enviado a
   ferramentas externas. O evento 'index:medicao' é sempre
   disparado no documento, o que facilita testes e integrações.
   ========================================================= */
(function () {
  'use strict';

  var Index = (window.Index = window.Index || {});

  function configuracao() {
    var cfg = window.INDEX_CONFIG || {};
    return cfg.medicao || {};
  }

  /* Traduz a chave interna (cliqueContato) para o nome configurado (clique_contato) */
  Index.nomeEvento = function (chave) {
    var eventos = configuracao().eventos || {};
    return eventos[chave] || chave;
  };

  Index.medir = function (chave, dados) {
    var cfg = configuracao();
    var nome = Index.nomeEvento(chave);
    var detalhe = Object.assign({ evento: nome }, dados || {});

    try {
      document.dispatchEvent(new CustomEvent('index:medicao', { detail: detalhe }));
    } catch (e) { /* navegadores muito antigos: ignora */ }

    if (!cfg.ativo) return;

    try {
      if (cfg.destino === 'gtag' && typeof window.gtag === 'function') {
        window.gtag('event', nome, dados || {});
      } else if (cfg.destino === 'personalizado' && typeof cfg.aoMedir === 'function') {
        cfg.aoMedir(nome, dados || {});
      } else if (cfg.destino === 'dataLayer') {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(Object.assign({ event: nome }, dados || {}));
      }
    } catch (erro) {
      /* Uma falha da ferramenta de medição nunca pode atrapalhar o visitante */
      if (window.console) console.warn('[Index] Falha ao registrar medição:', erro);
    }
  };
})();
