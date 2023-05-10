let data = {
  screen: {
    width: 640,
    height: 480,
    halfWidth: null,
    halfHeight: null,
  },
  render: {
    delay: 30,
  },
  rayCasting: {
    incrementAngle: null,
    precision: 64,
  },
  player: {
    fov: 60,
    halfFov: null,
    x: 2,
    y: 2,
    angle: 90,
    speed: {
      movement: 0.5,
      rotation: 5.0,
    },
  },
  map: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  key: {
    up: "KeyW",
    down: "KeyS",
    left: "KeyA",
    right: "KeyD",
  },
};

// Calculated data
data.screen.halfWidth = data.screen.width / 2;
data.screen.halfHeight = data.screen.height / 2;
data.rayCasting.incrementAngle = data.player.fov / data.screen.width;
data.player.halfFov = data.player.fov / 2;

// creating canvas at runtime
const screen = document.createElement("canvas");
screen.width = data.screen.width;
screen.height = data.screen.height;
screen.style.border = "1px solid black";
document.body.appendChild(screen);

// canvas context
const screenContext = screen.getContext("2d");

// degrees to radians
function degreesToRadians(degree) {
  let pi = Math.PI;
  return (degree * pi) / 180;
}

// function to draw line in canvas
function drawLine(x1, y1, x2, y2, cssColor) {
  screenContext.strokeStyle = cssColor;
  screenContext.beginPath();
  screenContext.moveTo(x1, y1);
  screenContext.lineTo(x2, y2);
  screenContext.stroke();
}

document.addEventListener("keydown", (event) => {
  let keyCode = event.code;

  if (keyCode === data.key.up) {
    let playerCos = Math.cos(degreesToRadians(data.player.angle));
    let playerSin = Math.sin(degreesToRadians(data.player.angle));
    data.player.x += playerCos;
    data.player.y += playerSin;
  } else if (keyCode === data.key.down) {
    let playerCos = Math.cos(degreesToRadians(data.player.angle));
    let playerSin = Math.sin(degreesToRadians(data.player.angle));
    data.player.x -= playerCos;
    data.player.y -= playerSin;
  } else if (keyCode === data.key.left) {
    data.player.angle -= data.player.speed.rotation
  } else if (keyCode === data.key.right) {
    data.player.angle += data.player.speed.rotation
  }
});

// raycasting logic
function rayCasting() {
  let rayAngle = data.player.angle - data.player.halfFov;

  for (let rayCount = 0; rayCount < data.screen.width; rayCount++) {
    //
    let ray = {
      x: data.player.x,
      y: data.player.y,
    };

    let rayCos =
      Math.cos(degreesToRadians(rayAngle)) / data.rayCasting.precision;
    let raySin =
      Math.sin(degreesToRadians(rayAngle)) / data.rayCasting.precision;

    let wall = 0;

    while (wall == 0) {
      ray.x += rayCos;
      ray.y += raySin;
      wall = data.map[Math.floor(ray.y)][Math.floor(ray.x)];
    }

    let distance = Math.sqrt(
      Math.pow(data.player.x - ray.x, 2) + Math.pow(data.player.y - ray.y, 2)
    );

    let wallHeight = Math.floor(data.screen.halfHeight / distance);

    drawLine(
      rayCount,
      0,
      rayCount,
      data.screen.halfHeight - wallHeight,
      "cyan"
    );
    drawLine(
      rayCount,
      data.screen.halfHeight - wallHeight,
      rayCount,
      data.screen.halfHeight + wallHeight,
      "red"
    );
    drawLine(
      rayCount,
      data.screen.halfHeight + wallHeight,
      rayCount,
      data.screen.height,
      "green"
    );

    rayAngle += data.rayCasting.incrementAngle;
  }
}

function clearScreen() {
  screenContext.clearRect(0, 0, data.screen.width, data.screen.height);
}

// main loop
function main() {
  setInterval(() => {
    clearScreen();
    rayCasting();
  }, data.render.delay);
}

// start
main();
