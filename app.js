const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 70,
  width: 50,
  height: 50,
  speed: 7
};

let score = 0;
let gameOver = false;
let win = false;

const bullets = [];
const explosions = [];
const stars = [];
const enemies = [];

const keys = {
  left: false,
  right: false
};

const enemyCount = 18;

// create enemies spread across the screen, mixed and not perfectly aligned
for (let i = 0; i < enemyCount; i++) {
  const baseX = Math.random() * (canvas.width - 90) + 20;
  const baseY = Math.random() * 180 + 40;

  enemies.push({
    x: baseX,
    y: baseY,
    width: 56,
    height: 56,
    alive: true,
    dx: (Math.random() < 0.5 ? -1 : 1) * (1.2 + Math.random() * 1.4),
    drift: Math.random() * 0.8 + 0.2,
    offset: Math.random() * Math.PI * 2
  });
}

for (let i = 0; i < 90; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.6 + 0.2
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;

  if (e.key === " " || e.code === "Space") {
    e.preventDefault();
    if (!gameOver && !win) {
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y - 12,
        width: 4,
        height: 14,
        speed: 9
      });
    }
  }

  if ((gameOver || win) && e.key.toLowerCase() === "r") {
    location.reload();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

function drawBackground() {
  const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bg.addColorStop(0, "#081427");
  bg.addColorStop(1, "#02040a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateStars() {
  for (let star of stars) {
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  }
}

function drawStars() {
  for (let star of stars) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function updatePlayer() {
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);

  ctx.shadowColor = "#7df9ff";
  ctx.shadowBlur = 25;

  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(-18, 10);
  ctx.lineTo(-8, 8);
  ctx.lineTo(-5, 22);
  ctx.lineTo(5, 22);
  ctx.lineTo(8, 8);
  ctx.lineTo(18, 10);
  ctx.closePath();

  const bodyGradient = ctx.createLinearGradient(0, -28, 0, 22);
  bodyGradient.addColorStop(0, "#9efcff");
  bodyGradient.addColorStop(0.5, "#4cc9ff");
  bodyGradient.addColorStop(1, "#2563eb");
  ctx.fillStyle = bodyGradient;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(-6, 2);
  ctx.lineTo(6, 2);
  ctx.closePath();
  ctx.fillStyle = "#dff8ff";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-18, 10);
  ctx.lineTo(-28, 18);
  ctx.lineTo(-10, 14);
  ctx.closePath();
  ctx.fillStyle = "#60a5fa";
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(18, 10);
  ctx.lineTo(28, 18);
  ctx.lineTo(10, 14);
  ctx.closePath();
  ctx.fillStyle = "#60a5fa";
  ctx.fill();

  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.moveTo(-7, 22);
  ctx.lineTo(0, 38);
  ctx.lineTo(7, 22);
  ctx.closePath();

  const flameGradient = ctx.createLinearGradient(0, 22, 0, 38);
  flameGradient.addColorStop(0, "#ffd166");
  flameGradient.addColorStop(1, "#ff5a36");
  ctx.fillStyle = flameGradient;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-3, 24);
  ctx.lineTo(0, 33);
  ctx.lineTo(3, 24);
  ctx.closePath();
  ctx.fillStyle = "#fff4a3";
  ctx.fill();

  ctx.restore();
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;

    if (bullets[i].y + bullets[i].height < 0) {
      bullets.splice(i, 1);
    }
  }
}

function drawBullets() {
  for (let bullet of bullets) {
    ctx.fillStyle = "#ffe66d";
    ctx.shadowColor = "#ffe66d";
    ctx.shadowBlur = 12;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    ctx.shadowBlur = 0;
  }
}

function updateEnemies() {
  const time = Date.now() * 0.002;

  for (let enemy of enemies) {
    if (!enemy.alive) continue;

    enemy.x += enemy.dx;
    enemy.y += 0.35 + enemy.drift * 0.35;
    enemy.x += Math.sin(time + enemy.offset) * 0.6;

    if (enemy.x <= 0) {
      enemy.x = 0;
      enemy.dx *= -1;
    }

    if (enemy.x + enemy.width >= canvas.width) {
      enemy.x = canvas.width - enemy.width;
      enemy.dx *= -1;
    }

    if (enemy.y + enemy.height >= player.y) {
      gameOver = true;
    }
  }
}

function drawPixelInvader(enemy) {
  const pattern = [
    "001100001100",
    "001100001100",
    "000111111000",
    "001111111100",
    "011011110110",
    "111111111111",
    "110111111011",
    "110110011011",
    "110000000011",
    "001111111100",
    "001100001100",
    "011000000110"
  ];

  const pixelSize = 4;
  const spriteWidth = pattern[0].length * pixelSize;
  const spriteHeight = pattern.length * pixelSize;

  const startX = enemy.x + (enemy.width - spriteWidth) / 2;
  const startY = enemy.y + (enemy.height - spriteHeight) / 2;

  ctx.save();

  ctx.shadowColor = "#22f0ff";
  ctx.shadowBlur = 12;

  const gradient = ctx.createLinearGradient(
    startX,
    startY,
    startX,
    startY + spriteHeight
  );
  gradient.addColorStop(0, "#4efcff");
  gradient.addColorStop(1, "#16dfe6");

  ctx.fillStyle = gradient;

  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      if (pattern[row][col] === "1") {
        ctx.fillRect(
          startX + col * pixelSize,
          startY + row * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
  }

  ctx.restore();
}

function drawEnemies() {
  for (let enemy of enemies) {
    if (enemy.alive) {
      drawPixelInvader(enemy);
    }
  }
}

function createExplosion(x, y) {
  for (let i = 0; i < 10; i++) {
    explosions.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      radius: Math.random() * 3 + 2,
      life: 20
    });
  }
}

function updateExplosions() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].x += explosions[i].dx;
    explosions[i].y += explosions[i].dy;
    explosions[i].life--;

    if (explosions[i].life <= 0) {
      explosions.splice(i, 1);
    }
  }
}

function drawExplosions() {
  for (let particle of explosions) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 180, 80, ${particle.life / 20})`;
    ctx.fill();
  }
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function checkCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bulletRemoved = false;

    for (let j = 0; j < enemies.length; j++) {
      if (enemies[j].alive && isColliding(bullets[i], enemies[j])) {
        createExplosion(
          enemies[j].x + enemies[j].width / 2,
          enemies[j].y + enemies[j].height / 2
        );

        enemies[j].alive = false;
        bullets.splice(i, 1);
        score += 1;
        bulletRemoved = true;
        break;
      }
    }

    if (bulletRemoved) continue;
  }

  const aliveEnemies = enemies.filter((enemy) => enemy.alive);
  if (aliveEnemies.length === 0) {
    win = true;
  }
}

function drawScore() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px Arial";
  ctx.fillText("Score: " + score, 20, 35);
}

function drawEndScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px Arial";

  if (win) {
    ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2 - 20);
  } else if (gameOver) {
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
  }

  ctx.font = "22px Arial";
  ctx.fillStyle = "#d8e6ff";
  ctx.fillText("Press R to restart", canvas.width / 2, canvas.height / 2 + 30);
  ctx.textAlign = "left";
}

function gameLoop() {
  drawBackground();
  updateStars();
  drawStars();

  if (!gameOver && !win) {
    updatePlayer();
    updateBullets();
    updateEnemies();
    checkCollisions();
  }

  updateExplosions();

  drawPlayer();
  drawEnemies();
  drawBullets();
  drawExplosions();
  drawScore();

  if (gameOver || win) {
    drawEndScreen();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
