// Получаем элементы
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const snakeImg = new Image();
snakeImg.src = "img/kaz.png";
const foodImg = new Image();
foodImg.src = "img/food.png";

let gameStarted = false;
let headerRemoved = false;

const snakeColors = [

  "#FF5252", // красный 
  "#FFFFFF",
  "#536DFE"
];

const baseSpeed = 200; // Начальная скорость
const minSpeed = 50; // Минимальная скорость
const speedStep = 5; // Шаг увеличения скорости
const scoreThreshold = 20; // Каждые 10 очков
let lastSpeedIncrease = 0; // Последний счет, когда увеличивали скорость

const headRotations = {
  up: 270,
  right: 0,
  down: 90,
  left: 180,
};

// Настройки игры
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let direction = "right";
let nextDirection = "right";
let score = 0;
let gameSpeed = 250;
let gameRunning = false;
let gameLoopId;

// Противоположные направления
const oppositeDir = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const header = document.querySelector(".title_h");
// Настраиваем размеры canvas
function setupCanvas() {
  const width = Math.min(window.innerWidth * 0.9, 600);
  const height = Math.min(window.innerHeight * 0.7, 600);

  const cols = Math.floor(width / gridSize);
  const rows = Math.floor(height / gridSize);

  canvas.width = cols * gridSize;
  canvas.height = rows * gridSize;

  if (gameRunning) {
    clearInterval(gameLoopId);
    gameLoopId = setInterval(gameLoop, gameSpeed);
  }
}

// Генерация еды
function generateFood() {
  const cols = canvas.width / gridSize;
  const rows = canvas.height / gridSize;

  food = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows),
  };

  // Проверка, чтобы еда не появилась на змейке
  for (let segment of snake) {
    if (segment.x === food.x && segment.y === food.y) {
      generateFood();
      break;
    }
  }
}

function setupEventListeners() {
  // Клавиатура
  document.addEventListener("keydown", (e) => {
    if (!gameStarted) {
      gameStarted = true;
      return;
    }

    const russianMap = {
      ц: "w",
      ы: "s",
      ф: "a",
      в: "d",
    };

    const key = russianMap[e.key.toLowerCase()] || e.key.toLowerCase();

    // Проверяем направление и предотвращаем поворот на 180°
    if (key === "arrowup" || key === "w") {
      if (direction !== "down") nextDirection = "up";
    } else if (key === "arrowdown" || key === "s") {
      if (direction !== "up") nextDirection = "down";
    } else if (key === "arrowleft" || key === "a") {
      if (direction !== "right") nextDirection = "left";
    } else if (key === "arrowright" || key === "d") {
      if (direction !== "left") nextDirection = "right";
    }

    // Пауза по пробелу
    else if (key === " ") {
      gameStarted = !gameStarted;
    }
  });

  // Мобильные кнопки
  const startOnPress = (dir) => {
    if (!gameStarted) gameStarted = true;
    if (direction !== oppositeDir[dir]) nextDirection = dir;
  };

  document
    .getElementById("up")
    .addEventListener("click", () => startOnPress("up"));
  document
    .getElementById("down")
    .addEventListener("click", () => startOnPress("down"));
  document
    .getElementById("left")
    .addEventListener("click", () => startOnPress("left"));
  document
    .getElementById("right")
    .addEventListener("click", () => startOnPress("right"));
}

// Игровой цикл
function gameLoop() {
  if (!gameStarted) return;

  direction = nextDirection;
  const head = { ...snake[0] };

  // Удаляем заголовок при первом нажатии
  if (!headerRemoved) {
    const header = document.getElementById("header-container");
    const subtitl = document.getElementById("header-containers");
    if (header) {
      header.remove();
      subtitl.remove();
      headerRemoved = true;

      // Пересчитываем размеры игрового поля
      setupCanvas();
    }
  }

  // Движение головы
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  // Проверка столкновений
  if (
    head.x < 0 ||
    head.x >= canvas.width / gridSize ||
    head.y < 0 ||
    head.y >= canvas.height / gridSize ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
    return;
  }

  // Добавление новой головы
  snake.unshift(head);

  // Проверка съедания еды
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }

  if (score >= lastSpeedIncrease + scoreThreshold && gameSpeed > minSpeed) {
    gameSpeed = Math.max(minSpeed, gameSpeed - speedStep); // Уменьшаем интервал
    lastSpeedIncrease = score; // Обновляем счетчик

    // Перезапускаем интервал с новой скоростью
    clearInterval(gameLoopId);
    gameLoopId = setInterval(gameLoop, gameSpeed);

    const speedElement = document.getElementById("speed-value");
    const speedMultiplier = (baseSpeed / gameSpeed).toFixed(1);
    speedElement.textContent = `${speedMultiplier}x`;
  }

  // Отрисовка
  draw();
}

// Завершение игры
function gameOver() {
  clearInterval(gameLoopId);
  gameRunning = false;
  alert("Игра окончена! Счет: " + score);
  resetGame();
}

// Сброс игры
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = "right";
  nextDirection = "right";
  score = 0;
  scoreElement.textContent = score;
  generateFood();
  gameStarted = false;
  gameRunning = true;
  gameSpeed = baseSpeed; // Сброс до начальной скорости
  lastSpeedIncrease = 0; // Сброс счетчика
  clearInterval(gameLoopId);
  gameLoopId = setInterval(gameLoop, gameSpeed);
}

// Отрисовка игры
function draw() {
  ctx.beginPath();
  // Очистка
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Еда
  ctx.drawImage(
    foodImg,
    food.x * gridSize,
    food.y * gridSize,
    gridSize,
    gridSize
  );

  // Змейка
  for (let i = 1; i < snake.length; i++) {
    
    const colorIndex = i % snakeColors.length;
    ctx.fillStyle = snakeColors[colorIndex];
    const segment = snake[i];
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  }

  // Голова с изображением
  if (snakeImg.complete) {
    const head = snake[0];
    const centerX = head.x * gridSize + gridSize / 2;
    const centerY = head.y * gridSize + gridSize / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((headRotations[direction] * Math.PI) / 180);
    ctx.drawImage(snakeImg, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
    ctx.restore();
  } else {
    // Фоллбэк если изображение не загрузилось
    ctx.fillStyle = "#0f0";
    ctx.fillRect(
      snake[0].x * gridSize,
      snake[0].y * gridSize,
      gridSize,
      gridSize
    );
  }
}

// Инициализация
function init() {
  setupCanvas();
  generateFood();
  setupEventListeners();
  resetGame();
}

// Обработка изменения размера окна
window.addEventListener("resize", setupCanvas);

// Запуск игры
init();

// Предотвращение скролла на мобильных
document.querySelectorAll(".control-btn").forEach((btn) => {
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
  });
});
