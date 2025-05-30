# 🎮 Jogo de Soletração

Um jogo interativo para auxiliar no aprendizado de crianças pequenas, onde o jogador precisa soletrar corretamente o nome de um animal a partir de uma imagem, dica e letras embaralhadas.

---

## 📌 Sobre o Projeto

O *Jogo de Soletração* é uma aplicação web desenvolvida com *Python (Flask)* e *HTML/CSS/JS*, que tem como objetivo principal tornar o aprendizado de vocabulário mais divertido. Ao acessar a página, o jogador vê uma imagem, uma dica e letras embaralhadas. A missão é formar corretamente a palavra relacionada à imagem apresentada.

---

## 🛠 Tecnologias Utilizadas

* *Python 3.12+*
* *Flask* (microframework para web)
* *HTML5, CSS3 e JavaScript*
* *Node.js v20+* (para gerenciar possíveis dependências front-end ou ambiente de desenvolvimento, se aplicável)

---

## 📁 Estrutura do Projeto


soletrando/
│
├── app.py                    # Servidor Flask principal
├── words.json                # Lista de palavras, imagens e dicas
│
├── templates/
│   └── index.html            # Página principal do jogo
│
├── static/
│   ├── css/
│   │   └── style.css         # Estilos do jogo
│   ├── js/
│   │   └── script.js         # Lógica da interação do jogo
│   └── images/
│       ├── cachorro.jpeg
│       ├── gato.jpeg
│       ├── sapo.jpeg
│       ├── macaco.jpeg
│       └── hamster.jpeg
│
└── README.md                 # Este arquivo


---

## 🔄 Funcionamento

1. O servidor Flask inicia e carrega o conteúdo do words.json.
2. A rota /get_random_words retorna 5 palavras aleatórias com:

   * A palavra correta
   * A palavra embaralhada
   * Uma dica
   * A imagem correspondente
3. O front-end exibe a imagem, a dica e as letras embaralhadas para o usuário montar a palavra.
4. O usuário interage com o jogo tentando formar a palavra correta.

---

## 📦 Dependências

Certifique-se de ter os seguintes recursos instalados:

### Backend

* Python 3.12+
* Flask

### Frontend

* Node.js v20+ (recomendado caso precise usar ferramentas como bundlers, preprocessadores ou frameworks JS)

### Instalação de dependências Python

bash
pip install flask


---

## ▶ Como Executar o Projeto

1. Clone o repositório:

bash
git clone https://github.com/seu-usuario/soletrando.git
cd soletrando


2. Instale o Flask (se ainda não instalado):

bash
pip install flask


3. Execute a aplicação:

bash
python app.py


4. Acesse no navegador:


http://localhost:5000


---

## 👨‍💻 Desenvolvedor

| Nome          | Contato                                         |
| ------------- | ----------------------------------------------- |
| Gabriela Borba | gborbas.gb@gmail.com |
| Laísa Albuquerque | laisaa275@gmail.com |

---

## 📜 Licença

Este projeto é livre para uso educacional e está licenciado sob a [MIT License](LICENSE).

---
