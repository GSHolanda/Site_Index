# Rastreia as marcas (símbolo da NASA e bandeiras) quadro a quadro por correlação de modelo
# uso: python3 -I rastrear.py <pasta-quadros> <saida.json>
import sys, os, json
import numpy as np
from PIL import Image
pasta, saida = sys.argv[1], sys.argv[2]
arqs = sorted(f for f in os.listdir(pasta) if f.startswith('f-'))
def carregar(f):
    return np.asarray(Image.open(os.path.join(pasta, f)).convert('RGB')).astype(np.float32)
ref = carregar('f-0075.png')
marcas = {'nasa': (659, 124, 9), 'bandeira_e': (633, 315, 7), 'bandeira_d': (676, 315, 7)}
modelos = {k: ref[y-r:y+r+1, x-r:x+r+1] for k, (x, y, r) in marcas.items()}
pos = {k: (x, y) for k, (x, y, r) in marcas.items()}
res = []
for f in arqs:
    im = carregar(f)
    linha = {'quadro': f}
    for k, (x0, y0, r) in marcas.items():
        px, py = pos[k]
        melhor = None
        for dy in range(-14, 5):          # o foguete sobe: procura mais para cima
            for dx in range(-3, 4):
                x, y = px + dx, py + dy
                if y - r < 0: continue
                janela = im[y-r:y+r+1, x-r:x+r+1]
                if janela.shape != modelos[k].shape: continue
                e = float(np.mean((janela - modelos[k]) ** 2))
                if melhor is None or e < melhor[0]: melhor = (e, x, y)
        e, x, y = melhor
        linha[k] = [x, y, round(e, 1)]
        if e < 900: pos[k] = (x, y)        # só atualiza quando o encaixe é bom
    res.append(linha)
json.dump(res, open(saida, 'w'))
for l in res[::10]:
    print(l['quadro'], {k: l[k] for k in marcas})
