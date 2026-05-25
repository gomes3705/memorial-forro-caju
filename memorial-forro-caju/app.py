from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    # Para desenvolvimento local
    app.run(debug=True, port=5000)

# ─── Para deploy no Render ────────────────────────────────────────────────────
# 1. Crie um arquivo "requirements.txt" com: flask gunicorn
# 2. No Render, defina o Start Command como:
#    gunicorn app:app
# 3. Suba todos os arquivos de /static e /templates junto.
# ──────────────────────────────────────────────────────────────────────────────
