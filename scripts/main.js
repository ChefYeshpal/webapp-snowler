const container = document.getElementById('game-container');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let W, H;
function resize() {
    W = container.clientWidth;
    H = container.clientHeight;
    canvas.width = W;
    canvas.height = H;
}
window.addEventListener('resize', resize);
resize();

let playerFort = { x: W / 2, y: H / 2, radius: 30, plaves: false };

let snowballs = [];
const snowballSpeed = 6;
const snowballRadius = 6;

container.addEventListener('click', (e) => {
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (!playerFort.placed) {
        playerFort.x = clickX;
        playerFort.y = clickY;
        playerFort.placed = true;
    } else {
        shootSnowball(clickX, clickY);
    }
});

function shootSnowball(targetX, targetY) {
    const dx =  targetX - playerFort.x;
    const dy = targetY - playerFort.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / dist) * snowballSpeed;
    const vy = (dy / dist) * snowballSpeed;
    snowballs.push({
        x: playerFort.x,
        y: playerFort.y,
        vx: vx,
        vy: vy,
        radius: snowballRadius
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, W, H);
    if (playerFort.placed) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(playerFort.x, playerFort.y, playerFort.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#99ccff';
        ctx.lineWidth = 3;
        ctx.stroke();
  } else {
        ctx.fillStyle = '#777777';
        ctx.font = '20px Arial';
        ctx.fillText('Click to place your fort', 20, 40);
  }

  for (let i = snowballs.length - 1; i >= 0; i--) {
    const sb = snowballs[i];
    sb.x += sb.vx;
    sb.y += sb.vy;

    if (sb.x < 0 || sb.x > W || sb.y < 0 || sb.y > H) {
      snowballs.splice(i, 1);
      continue;
    }

    ctx.fillStyle = '#ddf0ff';
    ctx.beginPath();
    ctx.arc(sb.x, sb.y, sb.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#99ccff';
    ctx.stroke();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();