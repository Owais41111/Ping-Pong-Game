const player1 = prompt("Enter Player 1 name (left side):");
const player2 = prompt("Enter Player 2 name (right side):");

const name1 = player1 && player1.trim() !== "" ? player1.trim() : "Player Left";
const name2 = player2 && player2.trim() !== "" ? player2.trim() : "Player Right";

const controlText = `Control: ${name1} (W and S) | ${name2} (↑ and ↓)`;
document.getElementById("controlText").textContent = controlText;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const restartBtn = document.getElementById("restart-btn");
const messageModal = document.getElementById("message-modal");
const messageText = document.getElementById("message");
const messageClose = document.getElementById("message-modal-close");

let animationId;
let gameRunning = false;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 8;
let ballSpeedY = 8;


const paddleHeight = 80;
const paddleWidth = 10;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
const paddleSpeed = 10;

let leftPlayerScore = 0;
let rightPlayerScore = 0;
const maxScore = 5;

let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFF";
  ctx.font = "15px Arial";

  // Center line
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#FFF";
  ctx.stroke();
  ctx.closePath();

  // Ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Left Paddle
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

  // Right Paddle
  ctx.fillRect(
    canvas.width - paddleWidth,
    rightPaddleY,
    paddleWidth,
    paddleHeight
  );

  // Scores
  ctx.fillText(`${name1}: ${leftPlayerScore}`, 10, 20);
  ctx.fillText(`${name2}: ${rightPlayerScore}`, canvas.width - 120, 20);
}

function update() {
  if (upPressed && rightPaddleY > 0) {
    rightPaddleY -= paddleSpeed;
  } else if (downPressed && rightPaddleY + paddleHeight < canvas.height) {
    rightPaddleY += paddleSpeed;
  }

  if (wPressed && leftPaddleY > 0) {
    leftPaddleY -= paddleSpeed;
  } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
    leftPaddleY += paddleSpeed;
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Left paddle hit
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Right paddle hit
  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballX < 0) {
    rightPlayerScore++;
    reset();
  } else if (ballX > canvas.width) {
    leftPlayerScore++;
    reset();
  }

  if (leftPlayerScore === maxScore) {
    playerWin(name1);
  } else if (rightPlayerScore === maxScore) {
    playerWin(name2);
  }
}

function reset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = Math.random() * 10 - 5;
}

function playerWin(player) {
  gameRunning = false;
  cancelAnimationFrame(animationId);
  messageText.textContent = `🎉 Congratulations! ${player} wins!`;
  messageModal.style.display = "block";
}

function loop() {
  update();
  draw();
  animationId = requestAnimationFrame(loop);
}

function keyDownHandler(e) {
  if (e.key === "ArrowUp") upPressed = true;
  else if (e.key === "ArrowDown") downPressed = true;
  else if (e.key === "w" || e.key === "W") wPressed = true;
  else if (e.key === "s" || e.key === "S") sPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "ArrowUp") upPressed = false;
  else if (e.key === "ArrowDown") downPressed = false;
  else if (e.key === "w" || e.key === "W") wPressed = false;
  else if (e.key === "s" || e.key === "S") sPressed = false;
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

startBtn.addEventListener("click", () => {
  if (!gameRunning) {
    gameRunning = true;
    loop();
  }
});

pauseBtn.addEventListener("click", () => {
  gameRunning = false;
  cancelAnimationFrame(animationId);
});

restartBtn.addEventListener("click", () => {
  location.reload();
});

messageClose.addEventListener("click", () => {
  location.reload();
});

window.addEventListener("load", draw);

