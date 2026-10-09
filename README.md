# Site da Index Participações

Site institucional de uma página da Index Participações, em português do Brasil, focado em apresentar a empresa com clareza e facilitar o início de conversas comerciais.

Foi feito em HTML, CSS e JavaScript simples, sem frameworks e sem etapa de compilação. Para publicar, basta copiar o conteúdo da pasta `site/` para a hospedagem.

> Itens que ainda dependem de informações da Index (contatos, destino do formulário, medição etc.) estão listados em [PENDENCIAS.md](PENDENCIAS.md).

---

## Estrutura de pastas

```
site/                       ← tudo o que vai para a hospedagem (public_html)
├── index.html              ← a página, com todas as seções
├── .htaccess               ← compressão e cache em servidores Apache (HostGator)
├── robots.txt / sitemap.xml
└── assets/
    ├── css/estilos.css     ← todos os estilos, organizados por seção
    ├── js/config.js        ← CONFIGURAÇÕES: contatos, formulário, medição
    ├── js/medicao.js       ← pontos de medição (cliques e envios)
    ├── js/site.js          ← menu, animações, setores, canais, WhatsApp
    ├── js/formulario.js    ← validação e envio do formulário
    ├── js/video-chamada.js ← decolagem que acompanha a rolagem na chamada final
    ├── fonts/              ← fontes hospedadas no próprio site (+ licenças)
    ├── video/              ← decolagem em MP4 e WebM
    └── img/                ← favicon, imagem de compartilhamento e imagens fixas da decolagem

docs/
├── marca/                  ← logotipo original enviado + versões vetoriais
├── og-imagem.html          ← modelo da imagem de compartilhamento
├── video/                  ← como o vídeo foi preparado e scripts que removeram as marcas
└── secoes-futuras.md       ← modelos prontos para clientes, depoimentos, casos e indicadores
```

## Como visualizar no computador

- **Rápido:** dê dois cliques em `site/index.html`.
- **Igual ao site publicado:** rode um servidor local na pasta `site/` e abra o endereço indicado:
  - `npx http-server site` (Node.js) ou
  - `python3 -m http.server --directory site 8080` (Python)

## Como atualizar o conteúdo

Todos os textos estão em `site/index.html`, separados por comentários com o nome de cada seção (`1. Primeira tela`, `2. A Index`, `3. Soluções`...).

| O que mudar | Onde |
|---|---|
| Textos de qualquer seção | `site/index.html`, dentro da seção correspondente |
| Uma frente de Soluções | copie um bloco `<li class="frente">` e ajuste título, itens e o atributo `data-objetivo` |
| Um setor em Áreas de atuação | copie um `<li class="setor">` e troque o nome e o ícone |
| E-mail, telefone, WhatsApp, endereço, redes sociais | `site/assets/js/config.js` |
| Destino do formulário | `site/assets/js/config.js` → `formulario.endpoint` |
| Link da Política de Privacidade | `site/assets/js/config.js` → `privacidade.url` |
| Cores, espaçamentos e fontes | variáveis no início de `site/assets/css/estilos.css` |

**Importante:** ao alterar `estilos.css` ou qualquer arquivo `.js`, aumente o número da versão nas linhas correspondentes do `index.html` (por exemplo `estilos.css?v=1` → `estilos.css?v=2`). Assim os visitantes recebem a versão nova em vez da guardada no navegador.

### Ícones

Os ícones são da família [Lucide](https://lucide.dev) (traço fino, mesma espessura em todos) e ficam no início do `index.html`, dentro de `<svg class="sprite">`. Para usar um ícone:

```html
<svg class="icone" aria-hidden="true"><use href="#i-compass"/></svg>
```

Para adicionar um ícone novo, copie o conteúdo do SVG do Lucide para um novo `<symbol id="i-nome" viewBox="0 0 24 24">…</symbol>` dentro do sprite.

### Botões de contato e a solução escolhida

Todo link para `#contato` leva ao formulário. Se o link tiver `data-objetivo`, a opção correspondente já vem selecionada no campo "Objetivo do contato":

| `data-objetivo` | Opção no formulário |
|---|---|
| `consultoria-estrategia` | Consultoria e estratégia empresarial |
| `estruturacao` | Estruturação de negócios |
| `projetos-inteligencia` | Projetos e inteligência de mercado |
| `relacionamento-institucional` | Relacionamento institucional |
| `outra` | Outra necessidade |

Links externos também funcionam: `https://indexparticipacoes.com.br/?objetivo=estruturacao#contato`.

## Formulário de contato

O formulário valida os campos no navegador (mensagens claras junto de cada campo e um resumo no topo) e envia os dados por `POST` para o endereço definido em `config.js`:

```js
formulario: {
  endpoint: 'https://...',   // URL que recebe o envio
  formato: 'json',           // 'json' ou 'formdata'
  cabecalhos: {},            // cabeçalhos extras, se a integração exigir
  tempoLimiteMs: 15000
}
```

Regras de funcionamento:

- **Sucesso só com confirmação real:** a mensagem de sucesso aparece apenas quando o destino responde com status 2xx. Respostas como `{"ok": false}` ou `{"success": false}` contam como falha.
- **Falha preserva os dados:** em qualquer erro (sem conexão, servidor fora do ar, tempo esgotado), os dados continuam no formulário e o visitante pode clicar em "Tentar novamente". Se houver WhatsApp ou e-mail configurados, eles são sugeridos como alternativa.
- **Sem destino configurado, nada é enviado** e o visitante vê a mensagem de falha. Um aviso técnico aparece somente no console do navegador.
- Um campo invisível (`_gotcha`) barra robôs de spam simples.

Campos enviados: `nome`, `empresa`, `email`, `telefone`, `objetivo` (texto da opção), `objetivo_codigo`, `mensagem`, `origem`, `pagina`, `enviado_em` e `_subject` (assunto sugerido, usado por alguns serviços de formulário).

O destino pode ser um serviço de formulários (que repassa as mensagens para um e-mail ou sistema) ou um sistema próprio da Index. Se for um sistema próprio em outro domínio, ele precisa aceitar requisições do domínio do site (CORS).

## Medição

Os pontos de medição já estão prontos e ficam **desligados** até a ferramenta ser escolhida:

| Evento | Quando acontece | Dados |
|---|---|---|
| `clique_contato` | clique em qualquer chamada para contato | `origem` (onde estava o botão), `objetivo` |
| `clique_whatsapp` | clique em qualquer link de WhatsApp | `origem` |
| `envio_formulario_confirmado` | envio confirmado pelo destino do formulário | `objetivo` |

Para ativar:

1. Cole o código da ferramenta no `index.html`, no ponto marcado com o comentário `MEDIÇÃO`.
2. Em `config.js`, defina `medicao.ativo: true` e o destino:
   - `'dataLayer'` para Google Tag Manager;
   - `'gtag'` para Google Analytics 4;
   - `'personalizado'` e uma função em `aoMedir` para qualquer outra ferramenta.

Os nomes dos eventos podem ser trocados em `medicao.eventos`. Mesmo desligada, a página dispara o evento `index:medicao` no `document`, útil para testes.

## WhatsApp

O botão flutuante só aparece quando houver um número em `config.js` (`contato.whatsapp`, somente números com DDI e DDD, por exemplo `5511900000000`). Ele surge depois que o visitante passa da primeira tela e se recolhe quando o formulário está visível, para não atrapalhar o preenchimento.

## Vídeo da chamada final

A seção "Vamos conversar sobre o seu negócio?" tem ao fundo a decolagem do foguete, que avança conforme o visitante rola a página. O símbolo da NASA e as bandeiras foram removidos digitalmente do trecho usado. Detalhes, comandos e scripts em [docs/video/LEIA-ME.md](docs/video/LEIA-ME.md).

- O vídeo (2,6 MB em MP4, 1,6 MB em WebM) só é baixado quando o visitante se aproxima da seção, e não pesa na abertura do site.
- Celulares, tablets em pé e quem prefere movimento reduzido veem uma imagem fixa da decolagem.
- Para trocar o vídeo, substitua `decolagem.mp4` e `decolagem.webm` mantendo os parâmetros de codificação descritos no LEIA-ME (um quadro-chave a cada 8 quadros, sem áudio), refaça as duas imagens fixas e aumente o `?v=` do vídeo em `video-chamada.js`.

## Logotipo e identidade visual

- O logotipo usado no site foi **vetorizado a partir do arquivo oficial enviado** (`docs/marca/logo-index-original.png`). A versão vetorial reproduz o original com 99,87% de sobreposição, pixel a pixel, e fica nítida em qualquer tamanho. Ela está no sprite do `index.html` (`<symbol id="logo-index">`) e em `docs/marca/` nas versões branca e azul.
- Se a Index tiver o arquivo vetorial original (SVG, PDF vetorial ou AI), basta trocar o conteúdo do `<symbol id="logo-index">` pelo caminho do arquivo original.
- O favicon usa o "X" do próprio logotipo sobre fundo azul.
- **Cores:** azul profundo como cor principal (`--azul-900` #0E2244, `--azul-950` #0A1730), turquesa como destaque (`--turquesa-500` #2BC3D6), fundos claros (`--papel` #FBFCFE, `--canvas` #F3F6FA). Todos os pares de texto passam do contraste mínimo de 4,5:1.
- **Fontes:** Schibsted Grotesk (títulos), Instrument Sans (textos) e IBM Plex Mono (rótulos pequenos), todas sem serifa e hospedadas no próprio site. Licenças em `site/assets/fonts/LICENCAS.txt`.
- **Elemento gráfico:** a marca no centro de uma rede que liga empresas compradoras, empresas vendedoras, parceiros e oportunidades. As linhas se desenham ao abrir a página e pulsos discretos percorrem as conexões.

### Imagem de compartilhamento

`site/assets/img/og-index.jpg` (1200×630) é a imagem que aparece ao compartilhar o link em redes sociais e aplicativos de mensagem. Para refazê-la, abra `docs/og-imagem.html` num navegador com a janela em 1200×630, capture a tela e salve como JPG nesse caminho.

## Publicação

1. Confirme o endereço definitivo do site nos pontos marcados com `DEPLOY STEP` (`index.html`, `robots.txt` e `sitemap.xml`).
2. Copie **o conteúdo** da pasta `site/` (não a pasta em si) para a pasta pública da hospedagem (`public_html` na HostGator), via FTP ou Gerenciador de Arquivos do cPanel. Inclua o arquivo `.htaccess`, que fica oculto em alguns sistemas.
3. Abra o site publicado no computador e no celular e faça um envio de teste pelo formulário.

## Acessibilidade e qualidade

Verificado com navegador automatizado (Chromium) em 320, 375, 390, 768, 1024, 1280, 1440, 1920 e 2560 px de largura:

- HTML semântico, hierarquia correta de títulos, link "Pular para o conteúdo", foco visível em todos os elementos e navegação completa pelo teclado.
- Menu do celular fecha com Esc, devolve o foco ao botão e mantém o foco dentro do menu aberto.
- Links do menu levam às seções sem esconder os títulos sob o cabeçalho fixo.
- Sem rolagem horizontal, botões com pelo menos 44 px de altura no celular.
- Movimento reduzido respeitado, inclusive quando a preferência muda com a página aberta.
- Página completa mesmo com o JavaScript desligado.
- Lighthouse no servidor local: celular com desempenho 98 e acessibilidade, boas práticas e SEO 100; computador com 100 nas quatro categorias. Abertura da página com cerca de 225 KB (o vídeo só carrega perto da seção) e nenhum deslocamento de layout durante o carregamento.
