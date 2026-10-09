/* =========================================================
   Formulário de contato
   - validação acessível (mensagens junto aos campos + resumo)
   - envio para o destino definido em config.js
   - sucesso somente com confirmação real do destino
   - em caso de falha, os dados ficam preservados e o visitante
     pode tentar de novo
   ========================================================= */
(function () {
  'use strict';

  var Index = (window.Index = window.Index || {});
  var form = document.getElementById('form-contato');
  if (!form) return;

  var CONFIG = (window.INDEX_CONFIG || {}).formulario || {};
  var resumo = form.querySelector('[data-resumo-erros]');
  var resumoLista = form.querySelector('[data-resumo-lista]');
  var falha = form.querySelector('[data-falha]');
  var falhaAlternativa = form.querySelector('[data-falha-alternativa]');
  var status = form.querySelector('[data-status]');
  var botao = form.querySelector('.form__botao');
  var botaoTexto = form.querySelector('.form__botao-texto');
  var sucesso = document.querySelector('[data-sucesso]');
  var enviando = false;
  var tentouEnviar = false;

  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* Regras de cada campo: devolvem a mensagem de erro ou '' quando está tudo certo */
  var regras = {
    nome: function (v) {
      if (!v) return 'Informe seu nome completo.';
      if (v.length < 3) return 'Informe seu nome completo, com pelo menos 3 letras.';
      return '';
    },
    email: function (v) {
      if (!v) return 'Informe seu e-mail.';
      if (!RE_EMAIL.test(v)) return 'Informe um e-mail válido, como nome@empresa.com.br.';
      return '';
    },
    telefone: function (v) {
      if (!v) return '';                                   // campo opcional
      var digitos = v.replace(/\D/g, '');
      if (digitos.length < 10 || digitos.length > 13) return 'Informe o telefone com DDD, por exemplo (11) 91234-5678.';
      return '';
    },
    objetivo: function (v) {
      return v ? '' : 'Selecione o objetivo do contato.';
    },
    mensagem: function (v) {
      if (!v) return 'Conte brevemente como a Index pode ajudar.';
      if (v.length < 10) return 'Escreva pelo menos 10 caracteres para a Index entender sua necessidade.';
      return '';
    }
  };

  var nomesCampos = {
    nome: 'Nome completo',
    email: 'E-mail',
    telefone: 'Telefone ou WhatsApp',
    objetivo: 'Objetivo do contato',
    mensagem: 'Como podemos ajudar?'
  };

  function controle(nome) { return form.elements[nome]; }
  function valor(nome) { var c = controle(nome); return c ? String(c.value || '').trim() : ''; }

  function mostrarErro(nome, mensagem) {
    var c = controle(nome);
    var campo = c.closest('.campo');
    var erro = document.getElementById(nome + '-erro');
    if (mensagem) {
      c.setAttribute('aria-invalid', 'true');
      campo.classList.add('invalido');
      if (erro) { erro.textContent = mensagem; erro.hidden = false; }
    } else {
      c.removeAttribute('aria-invalid');
      campo.classList.remove('invalido');
      if (erro) { erro.textContent = ''; erro.hidden = true; }
    }
  }

  function validarCampo(nome) {
    var mensagem = regras[nome](valor(nome));
    mostrarErro(nome, mensagem);
    return mensagem;
  }

  function validarTudo() {
    var erros = [];
    Object.keys(regras).forEach(function (nome) {
      var mensagem = validarCampo(nome);
      if (mensagem) erros.push({ nome: nome, mensagem: mensagem });
    });
    return erros;
  }

  function mostrarResumo(erros) {
    resumoLista.textContent = '';
    erros.forEach(function (erro) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + erro.nome;
      a.textContent = nomesCampos[erro.nome] + ': ' + erro.mensagem;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        controle(erro.nome).focus();
      });
      li.appendChild(a);
      resumoLista.appendChild(li);
    });
    resumo.hidden = false;
    resumo.focus();
  }

  function esconderResumoSeResolvido() {
    if (resumo.hidden) return;
    var restantes = Object.keys(regras).filter(function (nome) { return regras[nome](valor(nome)); });
    if (!restantes.length) resumo.hidden = true;
  }

  /* Valida ao sair do campo (só se algo foi digitado) e, depois da primeira
     tentativa de envio, enquanto o visitante corrige */
  Object.keys(regras).forEach(function (nome) {
    var c = controle(nome);
    c.addEventListener('blur', function () {
      if (nome === 'telefone') formatarTelefone();
      if (valor(nome) || tentouEnviar) validarCampo(nome);
      esconderResumoSeResolvido();
    });
    c.addEventListener(c.tagName === 'SELECT' ? 'change' : 'input', function () {
      if (tentouEnviar || c.getAttribute('aria-invalid') === 'true') validarCampo(nome);
      esconderResumoSeResolvido();
    });
  });

  /* Formata telefones brasileiros ao sair do campo: (11) 91234-5678 */
  function formatarTelefone() {
    var c = controle('telefone');
    var v = c.value.trim();
    if (!v || v.charAt(0) === '+') return;
    var d = v.replace(/\D/g, '');
    if (d.length === 11) c.value = '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    else if (d.length === 10) c.value = '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  }

  function textoObjetivo() {
    var select = controle('objetivo');
    var opcao = select.options[select.selectedIndex];
    return opcao && opcao.value ? opcao.text : '';
  }

  function montarDados() {
    return {
      nome: valor('nome'),
      empresa: valor('empresa'),
      email: valor('email'),
      telefone: valor('telefone'),
      objetivo: textoObjetivo(),
      objetivo_codigo: valor('objetivo'),
      mensagem: valor('mensagem'),
      origem: 'Site Index Participações',
      pagina: window.location.href.split('#')[0],
      enviado_em: new Date().toISOString(),
      _subject: 'Novo contato pelo site: ' + (textoObjetivo() || 'sem objetivo')
    };
  }

  function definirEnviando(ativo) {
    enviando = ativo;
    form.classList.toggle('enviando', ativo);
    form.setAttribute('aria-busy', String(ativo));
    botao.setAttribute('aria-disabled', String(ativo));
    botaoTexto.textContent = ativo ? 'Enviando...' : 'Enviar mensagem';
  }

  /* Envia de verdade e só resolve com sucesso se o destino confirmar */
  function enviar(dados) {
    var endpoint = String(CONFIG.endpoint || '').trim();
    if (!endpoint) {
      if (window.console) console.warn('[Index] Formulário sem destino configurado (INDEX_CONFIG.formulario.endpoint). Nenhum envio foi feito.');
      return Promise.reject(new Error('sem-destino'));
    }

    var controleTempo = 'AbortController' in window ? new AbortController() : null;
    var limite = Number(CONFIG.tempoLimiteMs) || 15000;
    var temporizador = controleTempo ? window.setTimeout(function () { controleTempo.abort(); }, limite) : null;

    var cabecalhos = Object.assign({ Accept: 'application/json' }, CONFIG.cabecalhos || {});
    var corpo;
    if (CONFIG.formato === 'formdata') {
      corpo = new FormData();
      Object.keys(dados).forEach(function (k) { corpo.append(k, dados[k]); });
    } else {
      cabecalhos['Content-Type'] = 'application/json';
      corpo = JSON.stringify(dados);
    }

    return fetch(endpoint, {
      method: 'POST',
      headers: cabecalhos,
      body: corpo,
      signal: controleTempo ? controleTempo.signal : undefined
    }).then(function (resposta) {
      if (temporizador) window.clearTimeout(temporizador);
      if (!resposta.ok) throw new Error('http-' + resposta.status);
      /* Alguns serviços respondem 200 com { ok: false } ou { success: false } */
      return resposta.text().then(function (texto) {
        if (!texto) return true;
        var json = null;
        try { json = JSON.parse(texto); } catch (e) { return true; }
        if (json && (json.ok === false || json.success === false || json.error || json.errors)) {
          throw new Error('recusado');
        }
        return true;
      });
    }, function (erro) {
      if (temporizador) window.clearTimeout(temporizador);
      throw erro;
    });
  }

  function mostrarFalha() {
    var canais = Index.canais || {};
    falhaAlternativa.textContent = '';
    var partes = [];
    if (canais.linkWhatsapp) partes.push({ texto: 'WhatsApp', href: canais.linkWhatsapp, externo: true });
    if (canais.email) partes.push({ texto: canais.email, href: 'mailto:' + canais.email });
    if (partes.length) {
      falhaAlternativa.appendChild(document.createTextNode('Se preferir, fale com a Index pelo '));
      partes.forEach(function (p, i) {
        if (i > 0) falhaAlternativa.appendChild(document.createTextNode(' ou pelo e-mail '));
        var a = document.createElement('a');
        a.href = p.href;
        a.textContent = p.texto;
        if (p.externo) { a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('data-whatsapp', 'falha-formulario'); }
        falhaAlternativa.appendChild(a);
      });
      falhaAlternativa.appendChild(document.createTextNode('.'));
      falhaAlternativa.hidden = false;
    } else {
      falhaAlternativa.hidden = true;
    }
    falha.hidden = false;
    falha.focus();
  }

  function mostrarSucesso() {
    form.hidden = true;
    sucesso.hidden = false;
    sucesso.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (enviando) return;
    tentouEnviar = true;
    falha.hidden = true;

    var erros = validarTudo();
    if (erros.length) {
      mostrarResumo(erros);
      return;
    }
    resumo.hidden = true;

    /* Robôs costumam preencher o campo invisível: nesse caso nada é enviado */
    if (valor('_gotcha')) return;

    var dados = montarDados();
    definirEnviando(true);
    status.textContent = 'Enviando sua mensagem.';

    enviar(dados).then(function () {
      definirEnviando(false);
      status.textContent = 'Mensagem enviada com sucesso.';
      if (Index.medir) Index.medir('envioConfirmado', { objetivo: dados.objetivo_codigo });
      form.reset();
      tentouEnviar = false;
      mostrarSucesso();
    }).catch(function () {
      definirEnviando(false);
      status.textContent = 'Não foi possível enviar sua mensagem. Seus dados foram mantidos.';
      mostrarFalha();
    });
  });

  /* Nova tentativa com os mesmos dados */
  form.querySelector('[data-tentar]').addEventListener('click', function () {
    if (typeof form.requestSubmit === 'function') form.requestSubmit();
    else form.dispatchEvent(new Event('submit', { cancelable: true }));
  });

  /* Depois de um envio confirmado, permite escrever outra mensagem */
  document.querySelector('[data-nova-mensagem]').addEventListener('click', function () {
    sucesso.hidden = true;
    form.hidden = false;
    falha.hidden = true;
    status.textContent = '';
    controle('nome').focus();
  });

  /* O botão "desabilitado" continua focável, mas não reenvia durante o envio */
  botao.addEventListener('click', function (e) {
    if (enviando) e.preventDefault();
  });
})();
