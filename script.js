(() => {
  const boardElement = document.querySelector('.board');
  const squares = Array.from(boardElement.querySelectorAll('.square'));
  const statusElement = document.getElementById('game-status');
  const resetButton = document.getElementById('reset-button');
  const modeInputs = document.querySelectorAll('input[name="mode"]');

  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let gameActive = true;
  let vsAI = false;

  const winningCombinations = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  function checkWin(player) {
    return winningCombinations.some(comb =>
      comb.every(index => board[index] === player)
    );
  }

  function checkDraw() {
    return board.every(cell => cell !== null);
  }

  function updateStatus(message) {
    statusElement.textContent = message;
  }

  function handleSquareClick(event) {
    const index = Number(event.target.dataset.index);
    if (!gameActive || board[index] !== null) return;

    makeMove(index, currentPlayer);

    if (vsAI && gameActive) {
      setTimeout(() => {
        const aiMove = getAIMove();
        if (aiMove !== null) {
          makeMove(aiMove, 'O');
        }
      }, 500);
    }
  }

  function makeMove(index, player) {
    board[index] = player;
    const square = squares[index];
    square.textContent = player;
    square.classList.add(player.toLowerCase());
    square.disabled = true;

    if (checkWin(player)) {
      updateStatus(`Player ${player} wins!`);
      gameActive = false;
      highlightWinningSquares(player);
      return;
    } else if (checkDraw()) {
      updateStatus("It's a draw!");
      gameActive = false;
      return;
    }

    currentPlayer = player === 'X' ? 'O' : 'X';
    updateStatus(`Player ${currentPlayer}'s turn`);
  }

  function highlightWinningSquares(player) {
    const winningLine = winningCombinations.find(comb =>
      comb.every(index => board[index] === player)
    );
    if (!winningLine) return;
    winningLine.forEach(index => {
      squares[index].style.boxShadow = `0 0 15px 4px ${player === 'X' ? '#d97706cc' : '#2563ebcc'}`;
      squares[index].style.borderRadius = '16px';
    });
  }

  function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    squares.forEach(square => {
      square.textContent = '';
      square.disabled = false;
      square.classList.remove('x', 'o');
      square.style.boxShadow = '';
    });
    updateStatus(`Player ${currentPlayer}'s turn`);
  }

  function getAIMove() {
    const available = board
      .map((val, idx) => val === null ? idx : null)
      .filter(val => val !== null);

    if (available.length === 0) {
      return null;
    }

    return available[Math.floor(Math.random() * available.length)];
  }

  squares.forEach(square => {
    square.addEventListener('click', handleSquareClick);
    square.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !square.disabled) {
        e.preventDefault();
        square.click();
      }
    });
  });

  resetButton.addEventListener('click', resetGame);

  modeInputs.forEach(input => {
    input.addEventListener('change', e => {
      vsAI = e.target.value === 'ai';
      resetGame();
    });
  });

  vsAI = document.querySelector('input[name="mode"]:checked').value === 'ai';
  updateStatus(`Player ${currentPlayer}'s turn`);
})();