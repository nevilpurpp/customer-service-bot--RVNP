
from flask import Flask, render_template, request


app = Flask(__name__)

load_dotenv()
gemini = os.getenv('Gemini_key')



@app.route('/')
def index():
    return render_template('index.html')


if(__name__ == "__main__"):
    app.run(debug=True)