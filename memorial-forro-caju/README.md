# 🪗 Memorial Forró Caju
### *Capital do País do Forró ·*

Aplicação web celebrando a cultura sergipana, desenvolvida para o **Arraiá do Povo e o Forró Caju** —  Cultura junina de Aracaju, SE.

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
    └── assets/                 
        ├── sanfona.mp3           ← Áudio da sanfona
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

Desenvolvido por **Gabriel Gomes A. De Faria** com ❤️ para o **Arraiá do povo e o Forró caju**  

· Local: Aracaju, SE

`#ForróCaju`   `#Aracaju` `#ArraiáDoPovo`
