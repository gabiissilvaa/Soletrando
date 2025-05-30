from flask import Flask, render_template, jsonify, send_from_directory
import random
import json
import os

app = Flask(__name__)

# Carrega as palavras e imagens
with open('words.json', 'r', encoding='utf-8') as f:
    words_data = json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_random_words')
def get_random_words():
    # Seleciona 5 palavras aleatórias sem repetição
    selected_words = random.sample(words_data, min(5, len(words_data)))
    
    # Prepara os dados para cada palavra
    result = []
    for word_data in selected_words:
        word = word_data['word'].upper()
        scrambled = list(word)
        random.shuffle(scrambled)
        
        result.append({
            'image': word_data['image'],
            'word': word,
            'scrambled': ''.join(scrambled),
            'hint': word_data.get('hint', '')
        })
    
    return jsonify(result)

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory('static/images', filename)

if __name__ == '__main__':
    app.run(debug=True)