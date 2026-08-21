const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const screenWidth = 640;
const screenHeight = 480;
const mapWidth = 24;
const mapHeight = 24;

canvas.width = screenWidth;
canvas.height = screenHeight;

const worldMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,2,2,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,3,0,0,0,3,0,0,0,1],
  [1,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,2,2,0,2,2,0,0,0,0,3,0,3,0,3,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,0,0,0,5,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,4,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  // Prevent page scrolling with arrow keys
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function keyDown(key) {
  return !!keys[key];
}

function int(value) {
  return Math.trunc(value);
}

function getWallColor(value) {
  switch (value) {
    case 1:
      return [255, 0, 0];       // Red
    case 2:
      return [0, 255, 0];       // Green
    case 3:
      return [0, 0, 255];       // Blue
    case 4:
      return [255, 255, 255];   // White
    default:
      return [255, 255, 0];     // Yellow
  }
}

let posX = 22;
let posY = 12;

let dirX = -1;
let dirY = 0;

let planeX = 0;
let planeY = 0.66;

let oldTime = performance.now();

function gameLoop() {
  const time = performance.now();

  const frameTime = (time - oldTime) / 1000;
  oldTime = time;

  render();

  const moveSpeed = frameTime * 5.0;

  const rotSpeed = frameTime * 3.0;

  // Move forward
  if (keyDown("ArrowUp")) {
    const newX = posX + dirX * moveSpeed;
    const newY = posY + dirY * moveSpeed;

    if (worldMap[int(newX)][int(posY)] === 0) {
      posX = newX;
    }

    if (worldMap[int(posX)][int(newY)] === 0) {
      posY = newY;
    }
  }

  // Move backward
  if (keyDown("ArrowDown")) {
    const newX = posX - dirX * moveSpeed;
    const newY = posY - dirY * moveSpeed;

    if (worldMap[int(newX)][int(posY)] === 0) {
      posX = newX;
    }

    if (worldMap[int(posX)][int(newY)] === 0) {
      posY = newY;
    }
  }

  // Rotate right
  if (keyDown("ArrowRight")) {
    const cos = Math.cos(-rotSpeed);
    const sin = Math.sin(-rotSpeed);

    const oldDirX = dirX;

    dirX = dirX * cos - dirY * sin;
    dirY = oldDirX * sin + dirY * cos;

    const oldPlaneX = planeX;

    planeX = planeX * cos - planeY * sin;
    planeY = oldPlaneX * sin + planeY * cos;
  }

  // Rotate left
  if (keyDown("ArrowLeft")) {
    const cos = Math.cos(rotSpeed);
    const sin = Math.sin(rotSpeed);

    const oldDirX = dirX;

    dirX = dirX * cos - dirY * sin;
    dirY = oldDirX * sin + dirY * cos;

    const oldPlaneX = planeX;

    planeX = planeX * cos - planeY * sin;
    planeY = oldPlaneX * sin + planeY * cos;
  }

  requestAnimationFrame(gameLoop);
}

function render() {
  ctx.clearRect(0, 0, screenWidth, screenHeight);

  //ceiling
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, screenWidth, screenHeight / 2);

  //floor
  ctx.fillStyle = "#444";
  ctx.fillRect(
    0,
    screenHeight / 2,
    screenWidth,
    screenHeight / 2
  );

  // Raycast every vertical screen column
  for (let x = 0; x < screenWidth; x++) {

    // Calculate ray position and direction
    const cameraX = 2 * x / screenWidth - 1;

    const rayDirX = dirX + planeX * cameraX;
    const rayDirY = dirY + planeY * cameraX;

    // Current map square
    let mapX = int(posX);
    let mapY = int(posY);

    // Distance to next x/y side
    let sideDistX;
    let sideDistY;

    // Distance between x/y sides
    const deltaDistX =
      rayDirX === 0 ? 1e30 : Math.abs(1 / rayDirX);

    const deltaDistY =
      rayDirY === 0 ? 1e30 : Math.abs(1 / rayDirY);

    let stepX;
    let stepY;

    let hit = false;
    let side = 0;

    // Calculate step and initial side distance
    if (rayDirX < 0) {
      stepX = -1;
      sideDistX =
        (posX - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX =
        (mapX + 1.0 - posX) * deltaDistX;
    }

    if (rayDirY < 0) {
      stepY = -1;
      sideDistY =
        (posY - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY =
        (mapY + 1.0 - posY) * deltaDistY;
    }

    // DDA
    while (!hit) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }

      if (worldMap[mapX][mapY] > 0) {
        hit = true;
      }
    }

    // Calculate perpendicular wall distance
    let perpWallDist;

    if (side === 0) {
      perpWallDist = sideDistX - deltaDistX;
    } else {
      perpWallDist = sideDistY - deltaDistY;
    }

    // Calculate wall height
    const lineHeight = int(screenHeight / perpWallDist);

    // Calculate drawing bounds
    let drawStart =
      -lineHeight / 2 + screenHeight / 2;

    if (drawStart < 0) {
      drawStart = 0;
    }

    let drawEnd =
      lineHeight / 2 + screenHeight / 2;

    if (drawEnd >= screenHeight) {
      drawEnd = screenHeight - 1;
    }

    // Get wall color
    let color = getWallColor(worldMap[mapX][mapY]);

    // Darken Y-side walls
    if (side === 1) {
      color = color.map(value => int(value / 2));
    }

    ctx.fillStyle =
      `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    // Draw vertical wall stripe
    ctx.fillRect(
      x,
      int(drawStart),
      1,
      int(drawEnd - drawStart + 1)
    );
  }

  // FPS counter
  const now = performance.now();
  const fps = Math.round(1000 / (now - oldTime));

  ctx.fillStyle = "white";
  ctx.font = "16px monospace";
  ctx.fillText(`FPS: ${fps}`, 10, 20);
}

// Start
gameLoop();
