/* =========================================================
   Configurações do site da Index Participações
   ---------------------------------------------------------
   Este é o único arquivo que precisa ser editado para ativar
   canais de contato, o destino do formulário e a medição.
   Campos vazios ficam ocultos no site: nada aparece "pela metade".
   Use somente dados oficiais e verificados.
   ========================================================= */
window.INDEX_CONFIG = {

  /* Canais oficiais exibidos na seção Contato e no rodapé */
  contato: {
    email: '',            // ex.: 'contato@seudominio.com.br'
    telefone: '',         // como deve aparecer na tela, ex.: '+55 11 0000-0000'
    whatsapp: '',         // somente números, com DDI e DDD, ex.: '5511900000000'
    mensagemWhatsapp: 'Olá! Vim pelo site da Index e gostaria de conversar.',
    endereco: ''          // ex.: 'Rua Exemplo, 100, Cidade, UF'
  },

  /* Redes sociais oficiais. Cada item: { nome: 'LinkedIn', url: 'https://...' } */
  redesSociais: [
    // { nome: 'LinkedIn', url: 'https://www.linkedin.com/company/...' },
    // { nome: 'Instagram', url: 'https://www.instagram.com/...' },
    // { nome: 'Facebook', url: 'https://www.facebook.com/...' }
  ],

  /* Destino do formulário de contato.
     O site só mostra a mensagem de sucesso quando o destino confirma o recebimento
     (resposta HTTP 2xx). Sem destino configurado, o envio não acontece e o visitante
     vê a mensagem de falha com os dados preservados. */
  formulario: {
    endpoint: '',         // URL que recebe o envio por POST
    formato: 'json',      // 'json' (corpo JSON) ou 'formdata' (como um formulário comum)
    cabecalhos: {},       // cabeçalhos extras exigidos pela integração, se houver
    tempoLimiteMs: 15000  // tempo máximo de espera pela confirmação
  },

  /* Política de Privacidade: quando houver, informe a URL para exibir os links */
  privacidade: {
    url: ''
  },

  /* Medição de cliques e envios. Fica desligada até a ferramenta ser definida. */
  medicao: {
    ativo: false,
    destino: 'dataLayer', // 'dataLayer' (Google Tag Manager), 'gtag' (Google Analytics 4) ou 'personalizado'
    eventos: {
      cliqueContato: 'clique_contato',
      cliqueWhatsapp: 'clique_whatsapp',
      envioConfirmado: 'envio_formulario_confirmado'
    },
    aoMedir: null         // opcional, para destino 'personalizado': function (evento, dados) { ... }
  }
};
