document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const statusText = document.getElementById("status");
    const resetButton = document.getElementById("resetButton");
    const winnerModal = document.getElementById("winnerModal");
    const winnerMessage = document.getElementById("winnerMessage");
    const restartButton = document.getElementById("restartButton");

    const playerXInput = document.getElementById("playerX");
    const playerOInput = document.getElementById("playerO");
    const playerXScoreText = document.getElementById("playerXScore");
    const playerOScoreText = document.getElementById("playerOScore");

    const playerVsPlayerButton = document.getElementById("playerVsPlayer");
    const playerVsAIButton = document.getElementById("playerVsAI");

    const moveSound = document.getElementById("moveSound");
    const winSound = document.getElementById("winSound");
    const drawSound = document.getElementById("drawSound");
    const backgroundMusic = document.getElementById("backgroundMusic");
    const toggleMusicButton = document.getElementById("toggleMusic");

    let currentPlayer = "X";
    let gameActive = true;
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let aiMode = false;
    let playerXScore = 0;
    let playerOScore = 0;
    let musicPlaying = false;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = clickedCell.getAttribute("data-index");

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        moveSound.play(); // Play move sound
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        checkResult();

        if (aiMode && gameActive && currentPlayer === "O") {
            aiMove();
        }
    }

    function checkResult() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            displayWinnerPopup(`Player ${currentPlayer} has won!`);
            updateScore();
            gameActive = false;
            return;
        }

        if (!gameState.includes("")) {
            displayWinnerPopup("Game is a draw!");
            drawSound.play(); // Play draw sound
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer === "X" ? playerXInput.value : playerOInput.value}'s turn`;
    }

    function updateScore() {
        if (currentPlayer === "X") {
            playerXScore++;
            playerXScoreText.textContent = `${playerXInput.value}: ${playerXScore}`;
        } else {
            playerOScore++;
            playerOScoreText.textContent = `${playerOInput.value}: ${playerOScore}`;
        }
        winSound.play(); // Play win sound
    }

    function resetGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        cells.forEach(cell => (cell.textContent = ""));
        statusText.textContent = `Player ${playerXInput.value}'s turn`;
        winnerModal.style.display = "none";
    }

    function aiMove() {
        let availableCells = [];
        gameState.forEach((cell, index) => {
            if (cell === "") availableCells.push(index);
        });

        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const aiCell = availableCells[randomIndex];

        gameState[aiCell] = currentPlayer;
        document.querySelector(`.cell[data-index="${aiCell}"]`).textContent = currentPlayer;
        checkResult();
    }

    function displayWinnerPopup(message) {
        winnerMessage.textContent = message;
        winnerModal.style.display = "flex";
    }

    function toggleMusic() {
        if (musicPlaying) {
            backgroundMusic.pause();
        } else {
            backgroundMusic.play();
        }
        musicPlaying = !musicPlaying;
    }

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    resetButton.addEventListener("click", resetGame);
    restartButton.addEventListener("click", resetGame);
    playerVsPlayerButton.addEventListener("click", () => {
        aiMode = false;
        resetGame();
    });
    playerVsAIButton.addEventListener("click", () => {
        aiMode = true;
        resetGame();
    });
    toggleMusicButton.addEventListener("click", toggleMusic);

    resetGame();
});