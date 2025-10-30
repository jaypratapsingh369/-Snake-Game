const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = false;
let gameLoop;
let speed = 100; // Initial speed in ms
let level = 1;

function randomTile() {
    return Math.floor(Math.random() * tileCount);
}

function generateFood() {
    food = {
        x: randomTile(),
        y: randomTile()
    };
}

function drawGame() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'lime';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check self collision
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        // Increase level every 50 points
        if (score % 50 === 0) {
            level++;
            levelElement.textContent = level;
            speed = Math.max(50, speed - 10); // Increase speed, minimum 50ms
            clearInterval(gameLoop);
            gameLoop = setInterval(() => {
                moveSnake();
                drawGame();
            }, speed);
        }
        generateFood();
    } else {
        snake.pop();
    }
}

function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    alert(`Game Over! Your score: ${score}`);
}

function changeDirection(event) {
    if (!gameRunning) return;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    level = 1;
    speed = 100;
    scoreElement.textContent = score;
    levelElement.textContent = level;
    generateFood();
    gameLoop = setInterval(() => {
        moveSnake();
        drawGame();
    }, speed);
}

function resetGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    level = 1;
    speed = 100;
    scoreElement.textContent = score;
    levelElement.textContent = level;
    generateFood();
    drawGame();
}

document.addEventListener('keydown', changeDirection);
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

// Initial draw
generateFood();
drawGame();
