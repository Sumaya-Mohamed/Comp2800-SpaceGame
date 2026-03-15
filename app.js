const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 55,
  width: 40,
  height: 24,
  speed: 7
};

let score = 0;
let level = 1;
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

const enemyRows = 3;
const enemyCols = 4;
const enemyWidth = 52;
const enemyHeight = 34;
const enemyGapX = 62;
const enemyGapY = 42;
const enemyStartX = canvas.width - 260;
const enemyStartY = 28;

for (let row = 0; row < enemyRows; row++) {
  for (let col = 0; col < enemyCols; col++) {
    enemies.push({
      x: enemyStartX + col * enemyGapX,
      y: enemyStartY + row * enemyGapY,
      width: enemyWidth,
      height: enemyHeight,
      alive: true,
      type: row === 0 ? "elite" : "regular"
    });
  }
}

for (let i = 0; i < 80; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.6 + 0.3,
    speed: Math.random() * 0.3 + 0.08,
    alpha: Math.random() * 0.6 + 0.2
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;

  if (e.code === "Space" || e.key === " ") {
    e.preventDefault();

    if (!gameOver && !win) {
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y - 12,
        width: 4,
        height: 14,
        speed: 8
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
  ctx.fillStyle = "#050505";
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
    ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
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
  const x = player.x;
  const y = player.y;

  ctx.save();
  ctx.shadowColor = "#ffe9b5";
  ctx.shadowBlur = 8;

  // center body
  ctx.fillStyle = "#fff6d8";
  ctx.fillRect(x + 14, y + 4, 12, 14);

  // nose
  ctx.beginPath();
  ctx.moveTo(x + 20, y);
  ctx.lineTo(x + 14, y + 8);
  ctx.lineTo(x + 26, y + 8);
  ctx.closePath();
  ctx.fill();

  // wings
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 12);
  ctx.lineTo(x + 3, y + 18);
  ctx.lineTo(x + 14, y + 18);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x + 26, y + 12);
  ctx.lineTo(x + 37, y + 18);
  ctx.lineTo(x + 26, y + 18);
  ctx.closePath();
  ctx.fill();

  // tail
  ctx.fillRect(x + 17, y + 18, 6, 4);

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
    ctx.save();
    ctx.fillStyle = "#ff8a3d";
    ctx.shadowColor = "#ffb06a";
    ctx.shadowBlur = 10;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    ctx.restore();
  }
}

function updateEnemies() {
  for (let enemy of enemies) {
    if (!enemy.alive) continue;

    enemy.y += 0.12 + level * 0.02;

    if (enemy.y + enemy.height >= player.y) {
      gameOver = true;
    }
  }
}

function drawRegularUFO(enemy) {
  const cx = enemy.x + enemy.width / 2;
  const cy = enemy.y + enemy.height / 2;

  ctx.save();
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = 4;

  // outer glow ring
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 23, 10, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#f7f7f7";
  ctx.fill();

  // orange ring
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 17, 6.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#d08a42";
  ctx.fill();

  // cockpit
  ctx.beginPath();
  ctx.ellipse(cx, cy - 7, 10, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#f4f4f4";
  ctx.fill();

  // bottom hole
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 7, 3.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#262626";
  ctx.fill();

  ctx.restore();
}

function drawEliteUFO(enemy) {
  const cx = enemy.x + enemy.width / 2;
  const cy = enemy.y + enemy.height / 2 - 2;

  ctx.save();
  ctx.shadowColor = "#fff4d8";
  ctx.shadowBlur = 6;

  // center body
  ctx.fillStyle = "#fff8e7";
  ctx.fillRect(cx - 8, cy - 6, 16, 14);

  // top spires
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy - 6);
  ctx.lineTo(cx - 6, cy - 16);
  ctx.lineTo(cx - 2, cy - 6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - 2, cy - 6);
  ctx.lineTo(cx + 2, cy - 18);
  ctx.lineTo(cx + 6, cy - 6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + 6, cy - 6);
  ctx.lineTo(cx + 10, cy - 14);
  ctx.lineTo(cx + 14, cy - 6);
  ctx.closePath();
  ctx.fill();

  // side wings
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy + 2);
  ctx.lineTo(cx - 16, cy + 8);
  ctx.lineTo(cx - 8, cy + 8);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx + 8, cy + 2);
  ctx.lineTo(cx + 16, cy + 8);
  ctx.lineTo(cx + 8, cy + 8);
  ctx.closePath();
  ctx.fill();

  // orange center
  ctx.beginPath();
  ctx.ellipse(cx, cy + 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#d58b44";
  ctx.fill();

  ctx.restore();
}

function drawEnemies() {
  for (let enemy of enemies) {
    if (!enemy.alive) continue;

    if (enemy.type === "elite") {
      drawEliteUFO(enemy);
    } else {
      drawRegularUFO(enemy);
    }
  }
}

function createExplosion(x, y) {
  for (let i = 0; i < 12; i++) {
    explosions.push({
      x: x,
      y: y,
      dx: (Math.random() - 0.5) * 3,
      dy: (Math.random() - 0.5) * 3,
      radius: Math.random() * 2 + 1,
      life: 18
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
    ctx.fillStyle = `rgba(255, 180, 100, ${particle.life / 18})`;
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
    for (let j = 0; j < enemies.length; j++) {
      if (enemies[j].alive && isColliding(bullets[i], enemies[j])) {
        createExplosion(
          enemies[j].x + enemies[j].width / 2,
          enemies[j].y + enemies[j].height / 2
        );

        enemies[j].alive = false;
        bullets.splice(i, 1);

        if (enemies[j].type === "elite") {
          score += 20;
        } else {
          score += 10;
        }

        break;
      }
    }
  }

  const aliveEnemies = enemies.filter((enemy) => enemy.alive);
  if (aliveEnemies.length === 0) {
    win = true;
  }
}

function drawHUD() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 14, 24);
  ctx.fillText("Level: " + level, 14, 44);
}

function drawEndScreen() {
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px Arial";

  if (win) {
    ctx.fillText("YOU WIN", canvas.width / 2, canvas.height / 2 - 10);
  } else {
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);
  }

  ctx.font = "18px Arial";
  ctx.fillText("Press R to restart", canvas.width / 2, canvas.height / 2 + 25);
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

  drawEnemies();
  drawBullets();
  drawExplosions();
  drawPlayer();
  drawHUD();

  if (gameOver || win) {
    drawEndScreen();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
