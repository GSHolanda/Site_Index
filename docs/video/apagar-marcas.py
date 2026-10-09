# Apaga o símbolo da NASA e as bandeiras do trecho da decolagem.
# Cada marca é preenchida coluna a coluna, interpolando entre a pintura logo acima
# e logo abaixo dela (o foguete é um cilindro vertical, então o sombreado se mantém).
# uso: python3 -I apagar-marcas.py <pasta-quadros> <rastro.json> <pasta-saida>
import sys, os, json
import numpy as np
from PIL import Image
pasta, rastro, saida = sys.argv[1:4]
os.makedirs(saida, exist_ok=True)
dados = json.load(open(rastro))
# deslocamento vertical do foguete por quadro (referência: quadro 75, parado na plataforma)
dys = []
for l in dados:
    n = int(l['quadro'][2:6])
    if n < 21:
        dys.append(0.0); continue
    xn, yn, en = l['nasa']; xb, yb, eb = l['bandeira_d']
    cands = [(en, yn - 124), (eb, yb - 315)]
    e, dy = min(cands)
    dys.append(float(dy) if e < 1500 else (dys[-1] if dys else 0.0))
# suaviza e garante que o movimento só vai para cima
dys = np.array(dys)
suave = np.convolve(np.pad(dys, 2, mode='edge'), np.ones(5) / 5, mode='valid')
suave = np.minimum.accumulate(np.minimum(suave, 0))
# marcas: centro na referência, meia largura, meia altura
MARCAS = [(659, 124, 7, 7), (633, 315, 4, 8), (676, 315, 4, 8)]
for i, l in enumerate(dados):
    im = np.asarray(Image.open(os.path.join(pasta, l['quadro'])).convert('RGB')).astype(np.float32)
    dy = suave[i]
    vel = abs(suave[i] - suave[i - 1]) if i else 0
    for cx, cy, rx, ry in MARCAS:
        y = int(round(cy + dy)); ry2 = ry + int(np.ceil(vel)) + 1    # rastro do desfoque de movimento
        y0, y1 = y - ry2, y + ry2
        x0, x1 = cx - rx - 1, cx + rx + 1
        if y1 < 2 or y0 > im.shape[0] - 3: continue
        y0 = max(y0, 1); y1 = min(y1, im.shape[0] - 2)
        acima = im[y0 - 1, x0:x1 + 1]
        abaixo = im[y1 + 1, x0:x1 + 1]
        for k, yy in enumerate(range(y0, y1 + 1)):
            t = (k + 1) / (y1 - y0 + 2)
            im[yy, x0:x1 + 1] = acima * (1 - t) + abaixo * t
    Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).save(os.path.join(saida, l['quadro']))
print('quadros tratados:', len(dados), 'deslocamento final:', round(float(suave[-30]), 1))
