document.addEventListener('DOMContentLoaded', function () {
    // Referências aos elementos HTML usados no jogo
    const scrambledLettersDiv = document.getElementById('scrambled-letters');
    const answerAreaDiv = document.getElementById('answer-area');
    const wordImage = document.getElementById('word-image');
    const hintText = document.getElementById('hint-text');
    const messageDiv = document.getElementById('message');

    // Variáveis do jogo
    let currentWord = '';
    let scrambledLetters = [];
    let selectedLetters = [];
    let wordsPool = [];      // Palavras ainda não usadas
    let retryPool = [];      // Palavras respondidas errado
    let currentWordData = null;

    // Inicia o jogo
    initGame();

    function initGame() {
        // Busca palavras do backend e inicia a primeira rodada
        fetch('/get_random_words') 
            .then(response => response.json())
            .then(data => {
                wordsPool = data.reverse();
                retryPool = [];
                startNewRound();
            });
        setupEventListeners(); // Placeholder para eventos extras
    }

    function startNewRound() {
        // Verifica se o jogo acabou
        if (wordsPool.length === 0 && retryPool.length === 0) {
            endGame();
            return;
        }

        // Seleciona a próxima palavra e exibe imagem e dica
        currentWordData = wordsPool.pop() || retryPool.pop();
        currentWord = currentWordData.word.toUpperCase();
        wordImage.src = `/images/${currentWordData.image}`;
        hintText.textContent = currentWordData.hint;

        // Embaralha as letras e prepara os slots
        scrambledLetters = shuffleArray(currentWord.split(''));
        selectedLetters = Array(currentWord.length).fill(null);

        renderGame(); // Atualiza a tela
        clearMessage();
    }

    function renderGame() {
        // Renderiza as letras disponíveis e os slots de resposta
        scrambledLettersDiv.innerHTML = '';
        answerAreaDiv.innerHTML = '';

        // Letras embaralhadas clicáveis
        scrambledLetters.forEach((letter, index) => {
            if (letter === null) return;

            const letterDiv = document.createElement('div');
            letterDiv.className = 'letter';
            letterDiv.textContent = letter;
            letterDiv.dataset.index = index;
            letterDiv.addEventListener('click', handleLetterClick);
            scrambledLettersDiv.appendChild(letterDiv);
        });

        // Slots para formar a palavra
        for (let i = 0; i < currentWord.length; i++) {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'letter-slot';
            slotDiv.dataset.index = i;

            if (selectedLetters[i]) {
                slotDiv.textContent = selectedLetters[i].letter;
                slotDiv.classList.add('filled');
                slotDiv.dataset.letterIndex = selectedLetters[i].originalIndex;
                slotDiv.addEventListener('click', handleSlotClick);
            }

            answerAreaDiv.appendChild(slotDiv);
        }
    }

    function handleLetterClick(event) {
        // Move a letra selecionada para o próximo slot vazio
        const letterIndex = event.target.dataset.index;
        const emptySlotIndex = selectedLetters.findIndex(slot => slot === null);
        if (emptySlotIndex === -1) return;

        selectedLetters[emptySlotIndex] = {
            letter: scrambledLetters[letterIndex],
            originalIndex: letterIndex
        };

        scrambledLetters[letterIndex] = null;
        renderGame();

        // Verifica a resposta se todos os slots estiverem preenchidos
        if (selectedLetters.every(slot => slot !== null)) {
            checkAnswer();
        }
    }

    function handleSlotClick(event) {
        // Remove a letra do slot e devolve para as opções embaralhadas
        const slotIndex = parseInt(event.target.dataset.index);
        const letterIndex = parseInt(event.target.dataset.letterIndex);

        scrambledLetters[letterIndex] = selectedLetters[slotIndex].letter;
        selectedLetters[slotIndex] = null;
        renderGame();
    }

    function checkAnswer() {
        // Compara a resposta do jogador com a palavra correta
        const answer = selectedLetters.map(slot => slot.letter).join('');
        const isCorrect = answer === currentWord;

        if (isCorrect) {
            showMessage('Parabéns! Próxima palavra...', 'success');
        } else {
            retryPool.unshift(currentWordData); // Palavra volta pra tentativa
            showMessage('Errado!', 'error');
        }

        // Avança para a próxima palavra após um tempo
        setTimeout(startNewRound, 2000);
    }

    function endGame() {
        // Exibe mensagem final e reinicia o jogo depois de alguns segundos
        showMessage('🎉 Você acertou todas as palavras! Reiniciando o jogo...', 'info');
        setTimeout(() => {
            initGame();
        }, 3000);
    }

    function showMessage(text, type) {
        // Mostra mensagens no topo da tela com estilo
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    }

    function clearMessage() {
        // Limpa qualquer mensagem anterior
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }

    function shuffleArray(array) {
        // Embaralha um array usando algoritmo Fisher-Yates
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
});
