# Modelos para seções futuras

Estes blocos usam as classes que já existem em `site/assets/css/estilos.css`, então entram na página sem estilos novos. Cole o bloco desejado no `site/index.html`, no ponto marcado com o comentário `Seções futuras` (entre Áreas de atuação e a chamada para contato), e troque os textos de exemplo pelos conteúdos aprovados.

Regras para manter a página consistente:

- Só publique conteúdo confirmado e autorizado (logotipos de clientes, nomes e falas de depoimentos, números).
- Alterne o fundo com as seções vizinhas: `secao--papel` (branco) e `secao--canvas` (cinza muito claro). Fundos escuros (`secao--escura`) ficam reservados para seções de destaque.
- Mantenha um `id` único e um título `h2` em cada seção.
- Se quiser a seção no menu, acrescente um `<li><a class="nav__link" href="#id-da-secao">Nome</a></li>` na navegação do cabeçalho e do rodapé.

## Clientes

```html
<section class="secao secao--canvas" id="clientes" aria-labelledby="clientes-titulo">
  <div class="container">
    <div class="cabeca-dividida revelar">
      <div>
        <p class="rotulo">Clientes</p>
        <h2 class="titulo-secao" id="clientes-titulo">Empresas que confiam na Index.</h2>
      </div>
      <p class="cabeca-dividida__texto">Texto curto e aprovado sobre os clientes.</p>
    </div>
    <ul class="setores revelar-grupo" aria-label="Clientes">
      <li class="setor"><img src="assets/img/clientes/cliente-1.svg" alt="Nome do cliente" width="140" height="40" loading="lazy"></li>
      <!-- repita um <li> por cliente -->
    </ul>
  </div>
</section>
```

## Depoimentos

```html
<section class="secao secao--papel" id="depoimentos" aria-labelledby="depoimentos-titulo">
  <div class="container">
    <div class="cabeca-dividida revelar">
      <div>
        <p class="rotulo">Depoimentos</p>
        <h2 class="titulo-secao" id="depoimentos-titulo">O que dizem sobre a Index.</h2>
      </div>
    </div>
    <ul class="frentes revelar-grupo">
      <li class="frente">
        <blockquote>
          <p class="lead">"Texto do depoimento, autorizado por quem falou."</p>
        </blockquote>
        <p class="pilar__texto" style="margin-top:20px"><strong>Nome da pessoa</strong>, cargo, empresa</p>
      </li>
      <!-- repita um <li class="frente"> por depoimento -->
    </ul>
  </div>
</section>
```

## Casos

```html
<section class="secao secao--canvas" id="casos" aria-labelledby="casos-titulo">
  <div class="container">
    <div class="cabeca-dividida revelar">
      <div>
        <p class="rotulo">Casos</p>
        <h2 class="titulo-secao" id="casos-titulo">Negócios estruturados pela Index.</h2>
      </div>
      <p class="cabeca-dividida__texto">Texto curto e aprovado sobre os casos.</p>
    </div>
    <ul class="frentes revelar-grupo">
      <li class="frente">
        <div class="frente__topo">
          <span class="frente__icone"><svg class="icone" aria-hidden="true"><use href="#i-handshake"/></svg></span>
          <span class="frente__numero" aria-hidden="true">Setor</span>
        </div>
        <h3 class="frente__titulo">Título do caso</h3>
        <ul class="frente__itens lista-conectada">
          <li>Desafio</li>
          <li>O que a Index fez</li>
          <li>Resultado confirmado</li>
        </ul>
        <a class="link-seta frente__cta" href="#contato" data-objetivo="estruturacao" data-cta="caso-nome">Conversar sobre um caso parecido<svg class="icone" aria-hidden="true"><use href="#i-arrow-right"/></svg></a>
      </li>
    </ul>
  </div>
</section>
```

## Indicadores

```html
<section class="secao secao--escura" id="indicadores" aria-labelledby="indicadores-titulo">
  <div class="container">
    <div class="cabeca-central revelar">
      <p class="rotulo rotulo--escuro">Indicadores</p>
      <h2 class="titulo-secao" id="indicadores-titulo">A Index em números.</h2>
    </div>
    <ul class="pilares revelar-grupo" style="border-color:rgba(195,206,223,.16)">
      <li class="pilar" style="border-color:rgba(195,206,223,.16)">
        <h3 class="pilar__titulo" style="color:#fff;font-size:2.5rem">00</h3>
        <p class="pilar__texto" style="color:var(--sobre-escuro)">O que o número representa (fonte e data).</p>
      </li>
      <!-- repita um <li class="pilar"> por indicador -->
    </ul>
  </div>
</section>
```
