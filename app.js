const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = 280;
let playerY = 550;
let score = 0;

const enemies = [
  { x: 80, y: 50, width: 40, height: 40 },
  { x: 180, y: 50, width: 40, height: 40 },
  { x: 280, y: 50, width: 40, height: 40 },
  { x: 380, y: 50, width: 40, height: 40 },
  { x: 480, y: 50, width: 40, height: 40 }
];

const bullets = [];

document.addEventListener("keydown", movePlayer);

function movePlayer(e) {
  if (e.key === "ArrowLeft" && playerX > 0) {
    playerX -= 20;
  }

  if (e.key === "ArrowRight" && playerX < 560) {
    playerX += 20;
  }

  if (e.key === " ") {
    bullets.push({ x: playerX + 17, y: playerY });
  }
}

function drawPlayer() {
  ctx.fillStyle = "white";
  ctx.fillRect(playerX, playerY, 40, 40);
}

function drawEnemies() {
  ctx.fillStyle = "red";
  for (let enemy of enemies) {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  for (let bullet of bullets) {
    ctx.fillRect(bullet.x, bullet.y, 6, 15);
  }
}

function updateBullets() {
  for (let bullet of bullets) {
    bullet.y -= 10;
  }
}

function updateEnemies() {
  for (let enemy of enemies) {
    enemy.y += 0.1;
  }
}

function checkCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (
        bullets[i].x < enemies[j].x + enemies[j].width &&
        bullets[i].x + 6 > enemies[j].x &&
        bullets[i].y < enemies[j].y + enemies[j].height &&
        bullets[i].y + 15 > enemies[j].y
      ) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score++;
        break;
      }
    }
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawEnemies();
  drawBullets();
  drawScore();

  updateBullets();
  updateEnemies();
  checkCollisions();

  requestAnimationFrame(gameLoop);
}

gameLoop();
