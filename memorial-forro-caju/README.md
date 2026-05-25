# 🪗 Memorial Forró Caju
### *Capital do País do Forró · HackAiá da Capsulana*

Aplicação web celebrando a cultura sergipana, desenvolvida para o **HackAiá da Capsulana** — hackathon de música, tecnologia e cultura junina de Aracaju, SE.

---

## 📁 Estrutura de Pastas

```
memorial-forro-caju/
├── app.py                        ← Servidor Flask
├── requirements.txt              ← Dependências Python
├── README.md
├── templates/
│   └── index.html                ← Página principal
└── static/
    ├── css/
    │   └── style.css             ← Estilos + animações
    ├── js/
    │   └── script.js             ← Lógica JS (áudio, canvas, tilt)
    └── assets/                   ← 📂 COLOQUE SEUS ARQUIVOS AQUI
        ├── sanfona.mp3           ← Áudio da sanfona (veja dica abaixo)
        ├── fogueira.mp4          ← Vídeo da fogueira em loop
        ├── mestrinho.jpg         ← Foto do artista
        ├── calcinha-preta.jpg
        ├── natanzinho.jpg
        └── heitor-costa.jpg
```

---

## 🚀 Rodando Localmente

```bash
# 1. Clone / baixe o projeto
cd memorial-forro-caju

# 2. Crie um ambiente virtual (recomendado)
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Rode o servidor
python app.py

# 5. Acesse no navegador
# http://localhost:5000
```

---

## 🔊 Como adicionar o áudio da sanfona

1. Acesse a **Biblioteca de Áudio do YouTube**: https://studio.youtube.com/channel/UC/music
2. Pesquise por: `baião sanfona`, `forró instrumental` ou `xote nordestino`
3. Baixe um arquivo **royalty-free** em `.mp3`
4. Salve como `static/assets/sanfona.mp3`
5. No `index.html`, descomente a linha:
   ```html
   <source src="{{ url_for('static', filename='assets/sanfona.mp3') }}" type="audio/mpeg" />
   ```

---

## 🔥 Como adicionar o vídeo de fogueira

**Opção A — Vídeo MP4 (recomendado):**
1. Baixe um vídeo de fogueira gratuito em: https://pixabay.com/videos/search/campfire/
2. Salve como `static/assets/fogueira.mp4`
3. No `index.html`, descomente:
   ```html
   <source src="{{ url_for('static', filename='assets/fogueira.mp4') }}" type="video/mp4" />
   ```

**Opção B — GIF:**  
Substitua a tag `<video>` por `<img src="...fogueira.gif" />` dentro da `.fire-bg`.

---

## 🖼️ Como adicionar fotos dos artistas

Substitua cada `<img src="https://images.unsplash.com/...">` pelo caminho real:
```html
<img src="{{ url_for('static', filename='assets/mestrinho.jpg') }}" alt="Mestrinho" />
```

---

## ☁️ Deploy no Render (gratuito)

1. Faça push do projeto para um repositório GitHub
2. Acesse https://render.com → **New Web Service**
3. Conecte o repositório
4. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Environment:** Python 3
5. Clique em **Deploy** — sua URL estará pronta em minutos!

---

## ✨ Funcionalidades

| Feature | Descrição |
|---|---|
| 🎬 Splash Screen | Tela de entrada com botão animado |
| 🪗 Áudio | Sanfona em loop com fade-in, mute e volume |
| ⭐ Canvas de Estrelas | 200 estrelas piscando no céu noturno |
| 🔥 Fagulhas | Partículas de fogo subindo animadas em canvas |
| 🃏 Cards com Tilt | Efeito 3D de inclinação ao mover o mouse |
| 💥 Partículas ao clicar | Explosão colorida no botão de entrada |
| 📜 Scroll Reveal | Elementos surgem ao rolar a página |
| 📱 Responsivo | Layout adaptado para mobile/tablet/desktop |
| ♿ Acessível | Suporte a `prefers-reduced-motion` e navegação por teclado |

---

## 🎨 Stack Tecnológico

- **Backend:** Python 3 + Flask
- **Frontend:** HTML5 · CSS3 · JavaScript (Vanilla)
- **Fontes:** Dela Gothic One · Boogaloo · Kalam · Nunito (Google Fonts)
- **Animações:** CSS Keyframes · Canvas API · RequestAnimationFrame

---

## 🤝 Créditos

Desenvolvido com ❤️ para o **HackAiá da Capsulana**  
Realização: **Inovase** · **CajuHub** · Prefeitura de Aracaju  
Evento: 22 e 23 de Maio · Local: CajuHub, Aracaju, SE

`#ForróCaju` `#HackAiá` `#CajuHub` `#Inovase` `#Aracaju`
