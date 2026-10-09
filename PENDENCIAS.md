# Pendências do site

Informações que dependem da Index Participações. Enquanto não forem definidas, o site funciona normalmente e **nada aparece incompleto para o visitante**: campos vazios ficam ocultos. A única exceção é o formulário, que precisa de um destino para enviar mensagens.

## Antes de publicar

- [ ] **Destino do formulário** (`site/assets/js/config.js` → `formulario.endpoint`).
  Sem ele, o formulário não envia nada e mostra a mensagem de falha ao visitante. Definir qual canal de atendimento vai receber os contatos (serviço de formulários, sistema de CRM ou sistema próprio) e testar um envio real depois de publicar.
- [ ] **Endereço definitivo do site.** O código usa `https://indexparticipacoes.com.br/`. Confirmar ou ajustar nos pontos marcados com `DEPLOY STEP` em `index.html`, `robots.txt` e `sitemap.xml`.
- [ ] **Revisão dos textos pela Index.** Os textos seguem o briefing aprovado, com pequenos ajustes de leitura para a web.

## Canais oficiais (aparecem automaticamente quando preenchidos em `config.js`)

- [ ] E-mail de contato.
- [ ] Telefone.
- [ ] WhatsApp oficial. Ativa o botão flutuante e o link na seção de contato e no rodapé.
- [ ] Endereço, se a Index quiser exibir.
- [ ] Redes sociais. O site atual mostra ícones de **Instagram, Facebook e LinkedIn**, mas os endereços não foram informados. Usar somente perfis confirmados (o site aceita apenas links `https://`).

## Privacidade e LGPD

- [ ] **Política de Privacidade.** Quando o texto existir, publicar a página e informar a URL em `config.js` → `privacidade.url`. Isso mostra o link no rodapé e um aviso junto ao botão de envio do formulário.
- [ ] Validar com o jurídico se o formulário deve ter um aviso ou consentimento específico sobre o uso dos dados.

## Medição

- [ ] Escolher a ferramenta (por exemplo, Google Tag Manager ou Google Analytics 4). Os eventos `clique_contato`, `clique_whatsapp` e `envio_formulario_confirmado` já estão prontos. Instruções no README.
- [ ] Se a ferramenta usar cookies de análise, avaliar a necessidade de um aviso de cookies.

## Marca

- [ ] **Arquivo vetorial original do logotipo** (SVG, PDF vetorial ou AI). O arquivo recebido (`logo-Index1.pdf`) era, na verdade, uma imagem WebP. O site usa uma versão vetorizada a partir dela, praticamente idêntica (99,87% de sobreposição). Se houver o vetor original, substituir.
- [ ] O arquivo recebido termina rente à base das letras e, por isso, corta a linha fina que, na versão grande do logotipo no site atual, passa sob todas as letras (no arquivo, aparece só um trecho no canto inferior direito). Confirmar qual é o desenho oficial e, se possível, enviar o arquivo com a linha completa.
- [ ] Favicon oficial, se existir. O atual usa o "X" do logotipo.

## Conteúdo para fases seguintes

Estrutura pronta para incluir sem retrabalho: modelos em [docs/secoes-futuras.md](docs/secoes-futuras.md).

- [ ] Clientes (logotipos com autorização de uso).
- [ ] Depoimentos (com autorização de quem fala).
- [ ] Casos de sucesso.
- [ ] Indicadores e resultados.

## Conteúdo do site atual que não foi usado

O briefing pediu para não incluir números, resultados ou afirmações sem confirmação. Por isso, estes trechos do site atual ficaram de fora e só devem voltar se a Index confirmar:

- "sócios e colaboradores em centenas de cidades" e "capilaridade espalhada em centenas de cidades";
- "uma das mais credenciadas no Brasil";
- "geramos dados de centenas de oportunidades";
- "conectar negócios em segundos" e "disparada automaticamente para todos os nossos stakeholders";
- a lista de países com conexões internacionais (Estados Unidos, China, Índia, Austrália, Espanha, Portugal, Argentina, Panamá);
- o subtítulo "Consultoria e Assessoria" que acompanha o logotipo no site atual.

## Vídeo da decolagem

O vídeo enviado foi usado na chamada final ("Vamos conversar sobre o seu negócio?"), com o símbolo da NASA e as bandeiras removidos digitalmente. Detalhes em [docs/video/LEIA-ME.md](docs/video/LEIA-ME.md).

- [ ] **Confirmar a origem e a licença do vídeo.** A animação parece ser da missão Artemis I da NASA. Esse tipo de material costuma ser de uso livre, mas os símbolos da NASA não podem sugerir associação ou endosso (por isso foram removidos). Se o arquivo veio de um banco de vídeos, conferir a licença de uso comercial.
- [ ] Guardar o arquivo original (29 MB) junto com os materiais da marca; ele não fica no repositório.
