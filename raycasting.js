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

    rayAngle += data.rayCasting.incrementAngle;
  }

  let distance = Math.sqrt(
    Math.pow(data.player.x - ray.x, 2) + Math.pow(data.player.y - ray.y, 2)
  );

  let wallHeight = Math.floor(data.screen.halfHeight / distance)

  
}

function clearScreen() {
  screenContext.clearRect(0, 0, data.screen.width, data.screen.height);
}

// start
main();

// main loop
function main() {
  setInterval(() => {
    clearScreen();
    rayCasting();
  }, data.render.delay);
}
