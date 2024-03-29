document.addEventListener('DOMContentLoaded', () => {
  const buttonSection = document.querySelector('.button-section');
  let startButton = document.querySelector('#start-game');

  function startGameHandler() {
    Game();
    startButton.style.display = 'none';
  }
  buttonSection.addEventListener('click', startGameHandler);
  document.addEventListener('keyup', startGameHandler);

  function Game() {
    // removing old event listener from keyup
    document.removeEventListener('keyup', startGameHandler);
    buttonSection.removeEventListener('click', startGameHandler);

    // Selecting DOM elements
    const bird = document.querySelector('.bird');
    const gameDisplay = document.querySelector('.game-container');
    const ground = document.querySelector('.ground-moving');
    const scoreDisplay = document.querySelector('#score');

    // Game variables
    let birdPositionX = 220;
    let birdPositionY = 100;
    let gravity = 3;
    let isGameOver = false;
    let gapBetweenObstacles = 450;
    let score = 0;

    // Start the game by moving the bird downwards
    function startGame() {
      birdPositionY -= gravity;
      bird.style.bottom = birdPositionY + 'px';
      bird.style.left = birdPositionX + 'px';
    }
    let gameTimerId = setInterval(startGame, 20);

    // Handle jump control
    function control() {
      jump();
    }
    document.addEventListener('keyup', control);
    buttonSection.addEventListener('click', control);

    // Bird jump action
    function jump() {
      if (birdPositionY < 500) birdPositionY += 50;
      bird.style.bottom = birdPositionY + 'px';
    }

    // Generate obstacles
    function generateObstacle() {
      if (!isGameOver) {
        // Set obstacle properties
        let obstaclePositionX = 450;
        let randomHeight = Math.random() * 60;
        let obstaclePositionY = randomHeight;

        // Create obstacle elements
        const obstacle = createObstacleElement(obstaclePositionX, obstaclePositionY);
        const topObstacle = createTopObstacleElement(obstaclePositionX, obstaclePositionY);

        // Render obstacles
        gameDisplay.appendChild(obstacle);
        gameDisplay.appendChild(topObstacle);

        // Move obstacles
        let timerId = setInterval(moveObstacle, 20);

        // Recursively generate next obstacle
        if (!isGameOver) setTimeout(generateObstacle, 3000);

        // Move obstacle horizontally and handle collisions
        function moveObstacle() {
          obstaclePositionX -= 2;
          obstacle.style.left = obstaclePositionX + 'px';
          topObstacle.style.left = obstaclePositionX + 'px';

          // Remove obstacle if it has passed
          if (obstaclePositionX === -10) {
            clearInterval(timerId);
            gameDisplay.removeChild(obstacle);
            gameDisplay.removeChild(topObstacle);
          }

          // Increment score if obstacle is passed
          if (obstaclePositionX === 200) {
            score++;
            scoreDisplay.textContent = score;
          }

          // Check for collision with obstacles or ground
          if (
            (obstaclePositionX > 200 &&
              obstaclePositionX < 280 &&
              (birdPositionY < obstaclePositionY + 153 ||
                birdPositionY > obstaclePositionY + gapBetweenObstacles - 200)) ||
            birdPositionY <= 0
          ) {
            gameOver();
            clearInterval(timerId);
          }
        }
      }
    }
    generateObstacle();

    // Utility function to create obstacle element
    function createObstacleElement(x, y) {
      const obstacle = document.createElement('div');
      obstacle.classList.add('obstacle');
      obstacle.style.left = x + 'px';
      obstacle.style.bottom = y + 'px';
      return obstacle;
    }

    // Utility function to create top obstacle element
    function createTopObstacleElement(x, y) {
      const topObstacle = document.createElement('div');
      topObstacle.classList.add('topObstacle');
      topObstacle.style.left = x + 'px';
      topObstacle.style.bottom = y + gapBetweenObstacles + 'px';
      return topObstacle;
    }

    // Game over logic
    function gameOver() {
      clearInterval(gameTimerId);
      console.log('Game over');
      isGameOver = true;
      document.removeEventListener('keyup', control);
      ground.classList.add('ground');
      ground.classList.remove('ground-moving');

      // display gameover
      startButton.innerHTML = `<div>Your score</div><div>${score}</div>`;
      startButton.style.fontSize = '40px';
      startButton.style.left = '30%';
      startButton.style.display = 'block';
      startButton.style.fontFamily = "'Press Start 2P', cursive";

      document.querySelector('.score').remove(); // removing scorebar
      // ways to restart the game
      buttonSection.addEventListener('click', () => location.reload());
      document.addEventListener('keyup', () => location.reload());
    }
  }
});
