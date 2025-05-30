document.addEventListener('DOMContentLoaded', function () {
    const scrambledLettersDiv = document.getElementById('scrambled-letters');
    const answerAreaDiv = document.getElementById('answer-area');
    const wordImage = document.getElementById('word-image');
    const hintText = document.getElementById('hint-text');
    const messageDiv = document.getElementById('message');

    let currentWord = '';
    let scrambledLetters = [];
    let selectedLetters = [];
    let wordsPool = [];
    let retryPool = [];
    let currentWordData = null;

    // Inicializa o jogo
    initGame();

    function initGame() {
        fetch('/get_random_words') // ← ROTA CORRIGIDA AQUI
            .then(response => response.json())
            .then(data => {
                wordsPool = data.reverse(); // .reverse para usar .pop()
                retryPool = [];
                startNewRound();
            });
        setupEventListeners();
    }

    function startNewRound() {
        if (wordsPool.length === 0 && retryPool.length === 0) {
            endGame();
            return;
        }

        currentWordData = wordsPool.pop() || retryPool.pop();
        currentWord = currentWordData.word.toUpperCase();
        wordImage.src = `/images/${currentWordData.image}`;
        hintText.textContent = currentWordData.hint;

        scrambledLetters = shuffleArray(currentWord.split(''));
        selectedLetters = Array(currentWord.length).fill(null);

        renderGame();
        clearMessage();
    }

    function renderGame() {
        scrambledLettersDiv.innerHTML = '';
        answerAreaDiv.innerHTML = '';

        scrambledLetters.forEach((letter, index) => {
            if (letter === null) return;

            const letterDiv = document.createElement('div');
            letterDiv.className = 'letter';
            letterDiv.textContent = letter;
            letterDiv.dataset.index = index;
            letterDiv.addEventListener('click', handleLetterClick);
            scrambledLettersDiv.appendChild(letterDiv);
        });

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
        const letterIndex = event.target.dataset.index;
        const emptySlotIndex = selectedLetters.findIndex(slot => slot === null);
        if (emptySlotIndex === -1) return;

        selectedLetters[emptySlotIndex] = {
            letter: scrambledLetters[letterIndex],
            originalIndex: letterIndex
        };

        scrambledLetters[letterIndex] = null;
        renderGame();

        if (selectedLetters.every(slot => slot !== null)) {
            checkAnswer();
        }
    }

    function handleSlotClick(event) {
        const slotIndex = parseInt(event.target.dataset.index);
        const letterIndex = parseInt(event.target.dataset.letterIndex);

        scrambledLetters[letterIndex] = selectedLetters[slotIndex].letter;
        selectedLetters[slotIndex] = null;
        renderGame();
    }

    function checkAnswer() {
        const answer = selectedLetters.map(slot => slot.letter).join('');
        const isCorrect = answer === currentWord;

        if (isCorrect) {
            showMessage('Parabéns! Próxima palavra...', 'success');
        } else {
            retryPool.unshift(currentWordData);
            showMessage('Errado!', 'error');
        }

        setTimeout(startNewRound, 2000);
    }

    function endGame() {
        showMessage('🎉 Você acertou todas as palavras! Reiniciando o jogo...', 'info');
        setTimeout(() => {
            initGame();
        }, 3000);
    }

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    }

    function clearMessage() {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
});
