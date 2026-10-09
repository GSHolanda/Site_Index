# Vídeo da decolagem (chamada final)

O vídeo usado na seção "Vamos conversar sobre o seu negócio?" é um trecho de 6,2 segundos da animação enviada pela Index (`CG-Animation-Of-Rocket-Taking-Off-index.mp4`, 143 s), com o símbolo da NASA e as bandeiras removidos digitalmente.

O arquivo original não está no repositório por causa do tamanho (29 MB). Guarde uma cópia junto com os demais materiais da marca.

## Onde as marcas aparecem no vídeo original

| Trecho | Marcas visíveis |
|---|---|
| 0 a 7 s (plataforma à noite) | bandeira dos EUA e símbolo da NASA |
| 8 a 15 s (decolagem ao entardecer) | símbolo da NASA na ponta e duas bandeiras pequenas: **removidos no trecho usado** |
| 15 a 21 s (motores e subida) | símbolo e bandeira grandes |
| 25 a 31 s (foguete no espaço) | letreiro vermelho no corpo do foguete |
| 35 s até o fim (nave, Terra, Lua, paraquedas) | nenhuma marca visível |

## Como o trecho foi preparado

1. Quadros extraídos de 7,5 s a 15,5 s do original:
   `ffmpeg -ss 7.5 -t 8 -i original.mp4 -vf fps=29.97 quadros/f-%04d.png`
2. Rastreamento das marcas quadro a quadro (o foguete sobe em linha reta):
   `python3 rastrear-marcas.py quadros rastro.json`
3. Remoção: cada marca é preenchida com a pintura do foguete logo acima e logo abaixo dela:
   `python3 apagar-marcas.py quadros rastro.json quadros-limpos`
4. Codificação a partir do quadro 30 (depois da fusão com a cena anterior), com um quadro-chave a cada 8 para a rolagem ficar lisa:
   - MP4 (H.264): `ffmpeg -framerate 30000/1001 -start_number 30 -i quadros-limpos/f-%04d.png -frames:v 186 -c:v libx264 -crf 19 -preset slow -g 8 -keyint_min 8 -pix_fmt yuv420p -movflags +faststart -an decolagem.mp4`
   - WebM (VP9), alternativa para navegadores sem H.264: `ffmpeg -framerate 30000/1001 -start_number 30 -i quadros-limpos/f-%04d.png -frames:v 186 -c:v libvpx-vp9 -crf 33 -b:v 0 -g 8 -keyint_min 8 -row-mt 1 -pix_fmt yuv420p -an decolagem.webm`
5. Imagens fixas: primeiro quadro (`decolagem-inicio.jpg`, mostrado enquanto o vídeo carrega) e último quadro (`decolagem-fim.jpg`, usado no celular, com movimento reduzido e se o vídeo falhar).

Os scripts dependem de Python 3 com Pillow e NumPy. As posições das marcas estão fixadas para este vídeo.

## Como o vídeo funciona na página

- Fica em `site/assets/video/` e é controlado por `site/assets/js/video-chamada.js`.
- Só é baixado quando o visitante se aproxima da seção, e por inteiro (funciona mesmo em hospedagens que não aceitam download parcial).
- Avança conforme a rolagem e volta quando o visitante rola para cima. O título sobe palavra por palavra junto com o foguete.
- Celulares, tablets em pé, celulares deitados e quem prefere movimento reduzido recebem a imagem fixa. Essas condições estão escritas de forma idêntica no CSS e no JavaScript.
- Se o vídeo não carregar, a imagem fixa assume e a página continua completa.
- Legibilidade conferida medindo o pixel mais claro sob o texto em vários pontos da rolagem: o título fica acima de 9,5:1 e o parágrafo acima de 5,2:1 de contraste, de 1024 a 1920 px de largura.
