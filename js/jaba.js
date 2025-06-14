const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ground = new Image();
ground.src = "img/rus.png";

const food = new Image();
food.src = "img/food.png";

const snakeImg = new Image();
snakeImg.src = 'img/kaz.png'

let box = 32;
let pole = 735;

let score = 0;

let foody = {
    x: Math.floor((Math.random() * 17 + 1)) * box,
    y: Math.floor((Math.random() * 15 + 1)) * box,
};

const snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box,
    
};



document.addEventListener("keydown", direction);
let dir;
function direction(event) {
    if (event.keyCode === 37) {
        dir = "left";
    } else if (event.keyCode === 38) {
        dir = "up";
    } else if (event.keyCode === 39) {
        dir = "right";
    } else if (event.keyCode === 40) {
        dir = "down";
    }


    if (event.keyCode === 65) {
        dir = "left";
    } else if (event.keyCode === 87) {
        dir = "up";
    } else if (event.keyCode === 68) {
        dir = "right";
    } else if (event.keyCode === 83) {
        dir = "down";
    }
}

function eatTail(head, arr) {
    for(let i = 0; i < arr.length; i++) {
        if(head.x == arr[i].x && head.y == arr[i].y) {
            clearInterval(game);
            alert('ТЫ НЕ УРОБОРОС! ХВАТИТ ЖРАТЬ СЕБЯ!!');
            location.reload();
        }
    }
}

function drawGame() {
    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(food, foody.x, foody.y);
    ctx.drawImage(snakeImg, snake[0].x, snake[0].y)
   
    

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0? 'transparent' : i == 1 ? 'white' : i == 2 ? 'blue' : i == 3 ? 'red' : 'black'
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        
    }

    ctx.fillStyle = "black";
    ctx.font = "50px Arial";
    ctx.fillText(score, box * -0.0, box * 1.5);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    

    if (snakeX == foody.x && snakeY == foody.y) {
        score++;
        foody = {
            x: Math.floor((Math.random() * 17 + 1)) * box,
            y: Math.floor((Math.random() * 15 + 1)) * box,
        };

    } else {
        snake.pop();
    }

    if(snakeX > pole || snakeY > pole || snakeX < -10|| snakeY < -10) {
        clearInterval(game)
        alert('ТЫ ПОЗОРИШЬ РОДИНУ')
        location.reload()
    }

    if (dir == "left") snakeX -= box;
    if (dir == "right") snakeX += box;
    if (dir == "up") snakeY -= box;
    if (dir == "down") snakeY += box;

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    eatTail(newHead, snake)

    snake.unshift(newHead);
}

let game = setInterval(drawGame, 100);
