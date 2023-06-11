let canvas = document.getElementById("breakoutCanvas");
let ctx = canvas.getContext("2d");

// Define the ball
let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 4,
    dy: -4,
    radius: 10
};

// Define the paddle
let paddle = {
    height: 20,
    width: 300,
    x: (canvas.width - 75) / 2
};

let rightPressed = false;
let leftPressed = false;

// Define the bricks
let brickRowCount = 5;
let brickColumnCount = 11;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Initialize score
let score = 0;

// Event listeners for moving the paddle
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "turquoise";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = "turquoise";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(ball.x > b.x && ball.x < b.x+brickWidth && ball.y > b.y && ball.y < b.y+brickHeight) {
                    ball.dy = -ball.dy;
                    b.status = 0;

                    // Increase score
                    score++;
                    if(score == brickRowCount * brickColumnCount) {
                        alert("Congratulations!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

// Draw the score
function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "turquoise";
    ctx.fillText("Score: " + score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if(ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }

    if(ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if(ball.y + ball.dy > canvas.height - ball.radius) {
        if(ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        } else {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        }
    }

    if(rightPressed) {
        paddle.x += 7;
        if (paddle.x + paddle.width > canvas.width){
            paddle.x = canvas.width - paddle.width;
        }
    } else if(leftPressed) {
        paddle.x -= 7;
        if (paddle.x < 0){
            paddle.x = 0;
        }
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
}

let interval = setInterval(draw, 10);

